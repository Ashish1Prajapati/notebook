import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.cjs.js";
import useHistory from "@/hooks/history";
import { drawElement, getElementAtPosition } from "@/utils/helper";
import CanvasThamnail from "./CanvasThamnail";
import Toolbar from "./Toolbar";
import ConfigurationModal from "../modals/ConfigurationModal";
const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, type, options, pageNo) {
  let roughElement;
  switch (type) {
    case "line":
      roughElement = generator.line(x1, y1, x2, y2, {
        stroke: options?.strokeColor,
        strokeWidth: options?.strokeWidth,
      });
      return { id, x1, y1, x2, y2, type, roughElement, options, pageNo };
    case "rectangle":
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
        stroke: options?.strokeColor,
        strokeWidth: options?.strokeWidth,
      });
      return { id, x1, y1, x2, y2, type, roughElement, options, pageNo };
    case "pencil":
      return { id, type, points: [{ x: x1, y: y1 }], options, pageNo };
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
}

const CanvasPage = ({ initialData }) => {
  const [tool, setTools] = useState("pencil");
  const [action, setAction] = useState("none");
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(100);
  const [activePage, setActivePage] = useState(1);
  const [elements, setElements, undo, redo] = useHistory([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [configuration, setConfiguration] = useState();
  const [options, setOptions] = useState({
    strokeWidth: 3,
    strokeColor: "black",
  });
  const [pages, setPages] = useState([
    {
      pageNo: 1,
      id: crypto.randomUUID(),
      layout: "/images/ruled.png",
    },
  ]);

  useLayoutEffect(() => {
    const canvas = document.getElementById(`canvas${activePage}`);
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);
    elements.forEach(
      (element) =>
        element.pageNo === activePage &&
        drawElement(roughCanvas, context, element)
    );
  }, [elements, activePage, pages, initialData]);
  useEffect(() => {
    if (initialData) {
      setPages(initialData?.pages);
      setElements(initialData?.elements, true);
      setOptions(initialData?.options);
      if (initialData?.config?.config) {
        setConfiguration(initialData?.config?.config);
      }
    }
  }, [initialData]);
  useEffect(() => {
    const undoRedoFunction = (evt) => {
      event.stopImmediatePropagation();
      if (
        (event.metaKey || event.ctrlKey) &&
        (event.key === "z" || event.key === "y")
      ) {
        if (
          event.key === "y" ||
          (evt.code === "KeyZ" && (evt.ctrlKey || evt.metaKey) && evt.shiftKey)
        ) {
          redo();
        } else {
          undo();
        }
      }
    };
    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [redo, undo]);
  const updateElement = (id, x1, y1, x2, y2, type, options, pageNo) => {
    const elementsCopy = [...elements];
    switch (type) {
      case "line":
      case "rectangle":
        elementsCopy[id] = createElement(
          id,
          x1,
          y1,
          x2,
          y2,
          type,
          options,
          pageNo
        );
        break;
      case "pencil":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    setElements(elementsCopy, true);
  };

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    const rect = document
      .getElementById(`canvas${activePage}`)
      .getBoundingClientRect();
    let newX = clientX - rect.left;
    let newY = clientY - rect.top;
    if (event.type === "touchstart") {
      event.preventDefault();
      newX = event.touches[0].clientX - rect.left;
      newY = event.touches[0].clientY - rect.top;
    }
    console.log(newX);
    const scaleAdjustment = scale / 100;
    newX = newX / scaleAdjustment;
    newY = newY / scaleAdjustment;

    if (tool === "selection" || tool === "eraser") {
      const element = getElementAtPosition(newX, newY, elements);
      if (element) {
        if (tool === "eraser") {
          setSelectedElement(element);
        } else {
          const offsets =
            element.type === "pencil"
              ? {
                  xOffsets: element.points.map((point) => newX - point.x),
                  yOffsets: element.points.map((point) => newY - point.y),
                }
              : { offsetX: newX - element.x1, offsetY: newY - element.y1 };
          setAction("moving");
          setSelectedElement({ ...element, ...offsets });
        }
        setElements((prev) => prev);
      }
    } else {
      const id = elements?.length;
      const element = createElement(
        id,
        newX,
        newY,
        newX,
        newY,
        tool,
        options,
        activePage
      );
      setElements((prev) => [...prev, element]);
      setAction("drawing");
    }
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = document
      .getElementById(`canvas${activePage}`)
      .getBoundingClientRect();
    let newX = clientX - rect.left;
    let newY = clientY - rect.top;
    if (event.type === "touchmove") {
      event.preventDefault();
      newX = event.touches[0].clientX - rect.left;
      newY = event.touches[0].clientY - rect.top;
    }
    const scaleAdjustment = scale / 100;
    newX = newX / scaleAdjustment;
    newY = newY / scaleAdjustment;
    if (tool === "selection") {
      event.target.style.cursor = getElementAtPosition(newX, newY, elements)
        ? "move"
        : "default";
    }
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1, options } = elements[index];
      updateElement(index, x1, y1, newX, newY, tool, options, activePage);
    } else if (action === "moving") {
      if (selectedElement.type === "pencil") {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: newX - selectedElement.xOffsets[index],
          y: newY - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY, options, pageNo } =
          selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        updateElement(
          id,
          newX1,
          newY1,
          newX1 + width,
          newY1 + height,
          type,
          options,
          pageNo
        );
      }
    }
  };
  const handleMouseUp = (event) => {
    event.preventDefault();
    if (tool === "eraser" && selectedElement) {
      const newElements = elements.filter(
        (element) => element.id !== selectedElement.id
      );
      setElements(newElements, true);
    }
    setAction("none");
    setSelectedElement(null);
  };
  // console.log(`scale(${scale / 100})`)
  return (
    <div className="relative flex justify-center flex-row select-none w-full">
      <ConfigurationModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <Toolbar
        scale={scale}
        configuration={configuration}
        initialData={initialData}
        setIsOpen={setIsOpen}
        elements={elements}
        setScale={setScale}
        undo={undo}
        redo={redo}
        setPages={setPages}
        setActivePage={setActivePage}
        activePage={activePage}
        setTools={setTools}
        tool={tool}
        setOptions={setOptions}
        options={options}
        setElements={setElements}
        pages={pages}
      />
      <div className="flex gap-5 w-full pb-16 p-24 ">
        <div className="">
          <CanvasThamnail
            pages={pages}
            setPages={setPages}
            elements={elements}
            setElements={setElements}
            setActivePage={setActivePage}
            activePage={activePage}
          />
        </div>
        <div
          style={{
            transform: `scale(${scale / 100})`,
            transformOrigin: "top left",
            // width: `${794 * 1.050}px`,
            // height: `${1024 * 1.050}px`,
          }}
          className="flex flex-col gap-2 relative pb-6"
        >
          <div
            className="relative"
            style={{ width: "794px", height: "1024px" }}
          >
            {pages[activePage - 1]?.layout && (
              <img
                className="absolute -z-10"
                src={pages[activePage - 1]?.layout}
                alt="background"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
            <canvas
              className="border-[3px] border-blue-700 "
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchMove={handleMouseMove}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              id={`canvas${activePage}`}
              width="794px"
              height="1024px"
            >
              Canvas
            </canvas>
            <p className="text-center font-bold">{activePage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
