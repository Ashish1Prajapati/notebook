import { drawElement } from '@/utils/helper'
import React, { useLayoutEffect } from 'react'
import rough from 'roughjs/bundled/rough.cjs.js'
export const handleAddPage = (setPages, setActivePage, pages, layout = "") => {
    const newPage = {
        pageNo: pages.length + 1,
        id: crypto.randomUUID(),
        layout: layout
    };
    setPages([...pages, newPage]);
    setActivePage(pages?.length + 1)
};

const CanvasThamnail = ({ elements, activePage, pages, setPages, setActivePage, setElements }) => {
    useLayoutEffect(() => {
        pages.forEach((page) => {
            const canvas = document.getElementById(`canvas-${page.pageNo}`);
            if (canvas) {
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                const roughCanvas = rough.canvas(canvas);
                elements.forEach((element) => {
                    if (element.pageNo === page.pageNo) {
                        drawElement(roughCanvas, context, element);
                    }
                });
            }
        });
    }, [elements, pages]);
 
    return (
        <div className='flex flex-col gap-8 h-[1024px] px-2 overflow-y-auto overflow-x-hidden relative'>
            {pages?.map((page, index) => (
                <div
                    key={page.id}
                    className={`border h-[10.2rem] w-[8rem] cursor-pointer ${activePage === index + 1 ? "border-blue-700" : ""}  flex flex-col items-center`}
                    onClick={() => setActivePage(index + 1)}
                >
                    <div className="w-full h-full relative">
                        {pages[index]?.layout && <img className='absolute -z-10 object-scale-down' width={"794px"} height={"1024px"} src={pages[index]?.layout} />}
                        <canvas
                            id={`canvas-${page.pageNo}`}
                            className="  w-full h-full object-contain"
                            width="794px"
                            height="1024px"
                        ></canvas>
                        <p className='text-center font-semibold'>{index + 1}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CanvasThamnail
