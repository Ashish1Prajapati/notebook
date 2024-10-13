export const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
export const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
};
export const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};
export const getSvgPathFromStroke = (stroke) => {
    if (!stroke.length) return "";
    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ["M", ...stroke[0], "Q"]
    );
    d.push("Z");
    return d.join(" ");
};
export const positionWithinElement = (x, y, element) => {
    const { type, x1, x2, y1, y2 } = element;
    switch (type) {
        case "line":
            const on = onLine(x1, y1, x2, y2, x, y);
            const start = nearPoint(x, y, x1, y1, "start");
            const end = nearPoint(x, y, x2, y2, "end");
            return start || end || on;
        case "rectangle":
            const topLeft = nearPoint(x, y, x1, y1, "tl");
            const topRight = nearPoint(x, y, x2, y1, "tr");
            const bottomLeft = nearPoint(x, y, x1, y2, "bl");
            const bottomRight = nearPoint(x, y, x2, y2, "br");
            const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
            return topLeft || topRight || bottomLeft || bottomRight || inside;
        case "pencil":
            const betweenAnyPoint = element.points.some((point, index) => {
                const nextPoint = element.points[index + 1];
                if (!nextPoint) return false;
                return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null;
            });
            return betweenAnyPoint ? "inside" : null;
        default:
            throw new Error(`Type not recognised: ${type}`);
    }
};

export const getElementAtPosition = (x, y, elements) => {
    return elements.find(element => positionWithinElement(x, y, element))
}
export const drawElement = async (roughCanvas, context, element) => {
    const { type, options } = element
    switch (type) {
        case "line":
        case "rect":
            roughCanvas.draw(element.roughElement)
            break;
        case "pencil":
            const getStroke = (await import('perfect-freehand')).default;
            const strokePoints = getStroke(element.points, {
                size: options?.strokeWidth || 4,
            });
            const pathData = getSvgPathFromStroke(strokePoints);
            const path = new Path2D(pathData);
            context.fillStyle = options?.strokeColor || "black";
            context.fill(path);
            break;

        default:
            throw new Error(`Type not recognised: ${type}`)
    }
}

export const shorthandText = (text, length) => {
    if (text?.length < length) {
        return text
    }
    return `${text.slice(0, length)} ...`

}
