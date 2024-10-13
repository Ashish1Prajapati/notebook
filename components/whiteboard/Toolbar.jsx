import { toolLists } from '@/contants/toolList'
import { Button, cn, Popover, PopoverContent, PopoverTrigger, Slider, Tooltip } from '@nextui-org/react'
import jsPDF from 'jspdf'
import { ArrowBigUp, ChevronDown, Copy, Expand, FileDown, FilePlus2, FileX2, Fullscreen, Minus, Plus, Redo, SaveAll, Scale, Settings, Slash, Undo } from 'lucide-react'
import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import { handleAddPage } from './CanvasThamnail'
const stockWidthList = [
    {
        title: "Fine",
        value: "3"
    },
    {
        title: "Medium",
        value: "6"
    },
    {
        title: "Thick",
        value: "12"
    },
    {
        title: "Custom Stroke Width",
        value: "custom",
    },

]
const colorList = [
    {
        title: "black",
        value: "#000000"
    },
    {
        title: "green",
        value: "#008000"
    },
    {
        title: "light green",
        value: "#90EE90"
    },
    {
        title: "blue",
        value: "#0000FF"
    },
    {
        title: "light blue",
        value: "#50e3c2"
    },
    {
        title: "gray",
        value: "#808080"
    },
    {
        title: "red",
        value: "#FF0000"
    },
    {
        title: "magenta",
        value: "#FF00FF"
    },
    {
        title: "orange",
        value: "#FFA500"
    },
    {
        title: "yello",
        value: "#FFFF00"
    },
    {
        title: "white",
        value: "#FFFFFF"
    },
    {
        title: "custom color",
        value: "custom"
    },
]

const layoutList = [
    {
        title: "White",
        value: "/images/blank.png"
    },
    {
        title: "Ruled Blue",
        value: "/images/ruled.png"
    },
    {
        title: "Ruled Black",
        value: "/images/ruled-black.png"
    },
    {
        title: "Graph with Axis",
        value: "/images/graphAxis.png"
    },
    {
        title: "Graph",
        value: "/images/graph-blue.png"
    },
    {
        title: "Isometric Graph",
        value: "/images/iso-graph.png"
    },
    {
        title: "Hex Paper",
        value: "/images/hex-paper.png"
    },
]

const Toolbar = ({ undo, redo, setTools, tool, setOptions, options, setElements, pages, setPages, setActivePage, activePage, setScale, setIsOpen, initialData, elements, configuration, scale }) => {
    const [pageLayoutOpen, setPageLayoutOpen] = useState(false)
    const [layout, setLayout] = useState("/images/ruled.png")
    const handleChange = (key, value) => {
        setOptions((prev) => ({ ...prev, [key]: value }))
    }
    const claenCavas = () => {
        setElements((prev) => prev.filter((el) => el.pageNo !== activePage))
    }
    const deletePage = () => {
        if (pages?.length > 1) {
            setElements((prev) => {
                const updatedElements = prev
                    .filter((el) => el.pageNo !== activePage)
                    .map((el) => {
                        if (el.pageNo > activePage) {
                            return { ...el, pageNo: el.pageNo - 1 };
                        }
                        return el;
                    });
                return updatedElements;
            }, true);

            setPages((prev) => {
                const updatedPages = prev
                    .filter((el) => el.pageNo !== activePage)
                    .map((el) => {
                        if (el.pageNo > activePage) {
                            return { ...el, pageNo: el.pageNo - 1 };
                        }
                        return el;
                    });

                return updatedPages;
            });
            setActivePage((prev) => (prev > 1 ? prev - 1 : prev));
        }
    }
    const downLoadpdf = () => {
        const pdf = new jsPDF("p", "mm", [210, 271]);
        pages.forEach((ele, index) => {
            const canvas = document.getElementById(`canvas-${index + 1}`);
            let url = canvas.toDataURL("image/png");
            if (index > 0) {
                pdf.addPage();
            }
            if (ele.layout) {
                const imgUrl = ele.layout
                if (imgUrl) {
                    pdf.addImage(imgUrl, 'JPEG', 0, 0, 210, 271)
                }
            }
            pdf.addImage(url, 'PNG', 0, 0);
        });
        pdf.save("download.pdf");
    }
    const pageUp = () => {
        if (activePage <= 1) {
            return;
        }

        setPages((prev) => {
            const allPages = [...prev];
            const page1 = allPages[activePage - 2];
            const page2 = allPages[activePage - 1];
            allPages[activePage - 2] = { ...page2, pageNo: page2.pageNo - 1 };
            allPages[activePage - 1] = { ...page1, pageNo: page1.pageNo + 1 };
            setActivePage(page2.pageNo);
            console.log(allPages)
            setElements((prev) => {
                return prev.map((el) => {
                    if (el.pageNo === activePage - 1) {
                        return { ...el, pageNo: activePage };
                    } else if (el.pageNo === activePage) {
                        return { ...el, pageNo: activePage - 1 };
                    }
                    return el;
                });
            });

            return allPages;
        });
    };
    const pageDown = () => {
        if (pages.length <= activePage) {
            console.log(activePage);
            return;
        }
        setPages((prev) => {
            const allPages = [...prev];
            const currentPage = allPages[activePage - 1];
            const nextPage = allPages[activePage];
            allPages[activePage - 1] = { ...currentPage, pageNo: nextPage.pageNo };
            allPages[activePage] = { ...nextPage, pageNo: currentPage.pageNo };
            setActivePage(currentPage.pageNo);
            setElements((prev) => {
                return prev.map((el) => {
                    if (el.pageNo === currentPage.pageNo) {
                        return { ...el, pageNo: nextPage.pageNo };
                    } else if (el.pageNo === nextPage.pageNo) {
                        return { ...el, pageNo: currentPage.pageNo };
                    }
                    return el;
                });
            });

            return allPages.sort((a, b) => a.pageNo - b.pageNo);
        });
    };
    const pageDuplicate = () => {
        if (pages?.length === activePage) {
            setPages((prev) => {
                const allPages = [...prev]
                const current = allPages.find((el) => el.pageNo === activePage)
                allPages.push({
                    pageNo: current.pageNo + 1,
                    id: crypto.randomUUID(),
                    layout: current.layout
                })
                setElements((prev) => {
                    const allEle = [...prev]
                    const current = allEle.filter((el) => el.pageNo === activePage)
                    const duplicatedElements = current.map((el) => { return { ...el, id: crypto.randomUUID(), pageNo: activePage + 1 } })
                    return [...allEle, ...duplicatedElements]
                })
                return allPages
            })
        }
        else {
            setPages((prev) => {
                const allPages = [...prev]
                const current = allPages.find((el) => el.pageNo === activePage)
                const newPages = allPages.map((el) => {
                    if (el.pageNo > activePage) {
                        return { ...el, pageNo: el.pageNo + 1 }
                    }
                    return { ...el }
                })
                newPages.push({
                    pageNo: current.pageNo + 1,
                    id: crypto.randomUUID(),
                    layout: current.layout
                })

                setElements((prev) => {
                    const allEle = [...prev]
                    const current = allEle.filter((el) => el.pageNo === activePage)
                    const duplicatedElements = current.map((el) => { return { ...el, pageNo: activePage + 1 } })
                    const updatedElements = allEle.map((el) => {
                        if (el.pageNo > activePage) {
                            return { ...el, pageNo: el.pageNo + 1 }
                        }
                        return { ...el }
                    })
                    return [...updatedElements, ...duplicatedElements]
                })
                return newPages.sort((a, b) => a.pageNo - b.pageNo)
            })
        }
    }
    const handleSave = () => {
        if (initialData?.id) {
            const allData = localStorage.getItem("data")
            const parsedData = JSON.parse(allData);
            localStorage.removeItem("data")
            let newSpace = {
                id: initialData.id,
                name: initialData?.name,
                pages: pages,
                options: options,
                elements: elements
            }
            const index = parsedData?.findIndex((el) => el.id === initialData?.id)
            console.log(index)
            if (index > -1) {
                const oldData = parsedData.splice(index, 1)
                console.log(oldData)
                newSpace = { ...newSpace, config: initialData?.config, createdAt: oldData[0].createdAt, updatedAt: `${new Date().toLocaleDateString()} At ${new Date().toLocaleTimeString()}` }
            }
            console.log(parsedData)
            const newData = [...parsedData]
            newData.push(newSpace)
            localStorage.setItem("data", JSON.stringify(newData))
        }
    }
    return (
        <>
            {/* top toolbar */}
            <div className='flex flex-row w-full justify-between absolute bg-white top-0 z-50 p-4 lg:px-20 xl:px-24  items-center border shadow-md'>
                <div className='flex flex-row lg:gap-1 xl:gap-2 items-center '>
                    {toolLists?.map((el, index) => {
                        if (configuration?.tools?.find((ele) => ele.value === el.value)?.active) {
                            return <StyledToolTip
                                content={el.title} key={index} placement='bottom'>
                                <Button isIconOnly variant='light' size='sm' onClick={() => setTools(el.value)} key={index} className={`flex  hover:bg-neutral-300 min-w-8 rounded-sm p-0 transition-all duration-200 justify-center items-center gap-2 ${tool === el.value && "bg-neutral-200"}`}>{el?.icon}</Button>
                            </StyledToolTip>
                        }
                    })}
                    {configuration?.tools?.find((el) => el.value === "history")?.active && <>
                        <StyledToolTip content={"Undo"} placement='bottom'>
                            <Button isIconOnly variant='light' size='sm' className='flex  hover:bg-neutral-300 rounded-sm transition-all duration-200 justify-center items-center min-w-8 p-0' onClick={() => undo()}>
                                <Undo />
                            </Button>
                        </StyledToolTip>
                        <StyledToolTip
                            content={"Redo"} placement='bottom'>
                            <Button isIconOnly variant='light' size='sm' className='flex  hover:bg-neutral-300 rounded-sm transition-all duration-200 justify-center items-center min-w-8 p-0' onClick={() => redo()}>
                                <Redo />
                            </Button>
                        </StyledToolTip>
                    </>}
                    <Slash color='#d3d3d3' className='rotate-[135deg] px-0' size={20} />
                    <div className='flex flex-row gap-1 px-0'>
                        {stockWidthList?.map((el, index) => {
                            if (configuration?.strockWidth?.find((ele) => ele.title === el.title)?.active) {
                                if (el.value !== "custom") {
                                    return <StyledToolTip key={index}
                                        content={el.title} placement='bottom'>
                                        <Button isIconOnly variant='light' size='sm' className={cn('flex  hover:bg-neutral-300 rounded-sm transition-all duration-200 justify-center items-center min-w-8 p-0', options.strokeWidth === el.value && "bg-neutral-200")} onClick={() => handleChange("strokeWidth", el.value)}>
                                            <div className={cn(`rounded-full bg-neutral-600 h-4 w-4 border border-black`, el.title === "Fine" && "h-1.5 w-1.5", el.title === "Medium" && "h-3 w-3")}></div>
                                        </Button>
                                    </StyledToolTip>
                                }
                                else {
                                    <Popover placement="bottom" showArrow offset={10}>
                                        <PopoverTrigger>
                                            <Button variant='light' size='sm' className={cn('flex  hover:bg-neutral-300 rounded-sm transition-all duration-200 justify-center items-center min-w-8 p-0')}>
                                                <StyledToolTip
                                                    content={"Stock Width"} placement='bottom'>
                                                    <div className={cn(`rounded-sm bg-neutral-600 h-4 w-4 border border-black`)}></div>
                                                </StyledToolTip>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[240px] rounded-sm">
                                            {(titleProps) => (
                                                <div className="px-1 py-2 w-full">
                                                    <p className="text-small font-bold text-foreground" {...titleProps}>
                                                        Strock Width
                                                    </p>
                                                    <div className="mt-2 flex flex-col gap-2 w-full">
                                                        <input value={options.strokeWidth} className='cursor-pointer' onChange={(e) => handleChange("strokeWidth", e.target.value)} type='range' min="1" max="30" />
                                                    </div>
                                                </div>
                                            )}
                                        </PopoverContent>
                                    </Popover>
                                }
                            }

                        })}

                    </div>
                    <Slash color='#d3d3d3' className='rotate-[135deg]' size={20} />
                    <div className='flex flex-row gap-1'>
                        {colorList?.map((el, index) => {
                            if (configuration?.colors?.find((ele) => ele.value === el.value)?.active) {
                                return <StyledToolTip key={index}
                                    content={el.title} placement='bottom'>
                                    {el.value === "custom" ?
                                        <Popover placement="bottom" showArrow offset={10}>
                                            <PopoverTrigger>
                                                <Button variant='light' size='sm' className={cn('flex  hover:bg-neutral-300 rounded-sm transition-all duration-200 justify-center items-center min-w-8 p-0')}>
                                                    <StyledToolTip
                                                        content={el.title} placement='bottom'>
                                                        <div style={{ background: options.strokeColor }} className={cn(`rounded-sm  h-4 w-4 border border-neutral-700 bg-[${el.value}]`)}></div>
                                                    </StyledToolTip>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[240px] rounded-sm">
                                                <div className="px-1 py-2 w-full">
                                                    <p className="text-small font-bold text-foreground capitalize">
                                                        {el.title}
                                                    </p>
                                                    <div className="mt-2 flex flex-col gap-2 w-full">
                                                        <SketchPicker
                                                            color={options.strokeColor}
                                                            onChangeComplete={(color) => {
                                                                console.log(color)
                                                                handleChange("strokeColor", color.hex)
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                            </PopoverContent>
                                        </Popover>
                                        :
                                        <Button isIconOnly variant='light' size='sm' className={cn('flex  hover:bg-neutral-300 rounded-sm transition-all duration-200 justify-center items-center min-w-8 p-0', options.strokeColor === el.value && "bg-neutral-200")} onClick={() => handleChange("strokeColor", el.value)}>
                                            <div style={{ background: el.value }} className={cn(`rounded-full  h-4 w-4 border border-neutral-700 bg-[${el.value}]`)}></div>
                                        </Button>}
                                </StyledToolTip>
                            }
                        })}
                    </div>
                    <Slash color='#d3d3d3' className='rotate-[135deg]' size={20} />
                    {configuration?.pages?.find((ele) => ele.value === "addPage")?.active && <StyledToolTip
                        content={"Add new page"} placement='bottom'>
                        <div className='flex flex-row gap-0'>
                            <Button isIconOnly variant='light' size='sm' onClick={() => handleAddPage(setPages, setActivePage, pages, layout)} className={`flex  hover:bg-neutral-300 min-w-6 p-0 px-2 rounded-sm transition-all duration-200 justify-center items-center gap-2 font-semibold`}><FilePlus2 size={20} /></Button>
                            <Popover isOpen={pageLayoutOpen} placement="bottom" showArrow offset={10}>
                                <PopoverTrigger>
                                    <Button  onClick={() => setPageLayoutOpen(true)} variant='light' size='sm' className={cn('flex  hover:bg-neutral-300 rounded-sm transition-all duration-200 justify-center items-center min-w-2 p-0 ')}>
                                        <ChevronDown size={20} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[40rem] rounded-sm">
                                    <div className="px-1 py-2 w-full">
                                        <p className="text-small font-bold text-foreground capitalize">
                                            {"Page Layouts"}
                                        </p>
                                        <div className="mt-2 grid grid-cols-3 gap-5 w-full">
                                            {layoutList?.map((el, index) => {
                                                return <div onClick={() => { setLayout(el.value), setPageLayoutOpen(false), handleAddPage(setPages, setActivePage, pages, el.value) }} key={index} className={`flex flex-col gap-2 p-2 justify-center items-center cursor-pointer hover:bg-neutral-200 transition-all duration-200 ${layout === el.value && "bg-neutral-200"}`}>
                                                    <img className='border rounded-sm' src={el.value} />
                                                    <h1 className='font-medium'>{el.title}</h1>
                                                </div>
                                            })}
                                        </div>
                                    </div>

                                </PopoverContent>
                            </Popover>

                        </div>
                    </StyledToolTip>}
                    {configuration?.pages?.find((ele) => ele.value === "deletePage")?.active && <StyledToolTip
                        content={"Delete active page"} placement='bottom'>
                        <Button isIconOnly disabled={pages?.length <= 1} variant='light' size='sm' onClick={() => deletePage()} className={`flex  hover:bg-neutral-300 min-w-6 rounded-sm transition-all duration-200 justify-center items-center gap-2 font-semibold`}><FileX2 size={20} /></Button>
                    </StyledToolTip>}
                    {configuration?.others?.find((ele) => ele.value === "downloadPdf")?.active && <StyledToolTip
                        content={"download pdf"} placement='bottom'>
                        <Button isIconOnly variant='light' size='sm' onClick={() => downLoadpdf()} className={`flex  hover:bg-neutral-300 min-w-6 rounded-sm transition-all duration-200 justify-center items-center gap-2 font-semibold`}><FileDown size={20} /></Button>
                    </StyledToolTip>}
                    {configuration?.others?.find((ele) => ele.value === "clear")?.active && <StyledToolTip
                        content={"clear canvas"} placement='bottom'>
                        <Button  variant='flat' size='sm' onClick={() => claenCavas()} className={`flex  hover:bg-neutral-300 min-w-6 rounded-sm transition-all duration-200 justify-center items-center gap-2 font-semibold`}>Clear</Button>
                    </StyledToolTip>}
                </div>
                <div className='flex flex-row gap-3'>
                    {/* {configuration?.others?.find((ele) => ele.value === "configuration")?.active && <Button variant='flat' size='sm' onClick={() => setIsOpen(true)} className={`flex  hover:bg-neutral-300 min-w-6 rounded-sm transition-all duration-200 justify-center items-center gap-2 font-semibold`}>   <Settings size={20} />
                        Configuration
                    </Button>} */}
                    {configuration?.others?.find((ele) => ele.value === "save")?.active && <Button variant='flat' size='sm' onClick={() => handleSave()} className={`flex  hover:bg-neutral-300 min-w-6 rounded-sm transition-all duration-200 justify-center items-center gap-2 font-semibold`}>    <SaveAll size={20} />
                        Save
                    </Button>}

                </div>
            </div>
            {/* bottom toolbar */}
            <div className='fixed bottom-0 flex flex-row items-center px-24 shadow-lg w-full border justify-between bg-white z-50'>
                <div className='flex gap-1 justify-center'>
                    {configuration?.pages?.find((ele) => ele.value === "pageUp")?.active && <StyledToolTip content={"Page Up"} placement='bottom'>
                        <Button isIconOnly variant='light' size='sm' className='flex  hover:bg-neutral-300 rounded-sm transition-all duration-200 justify-center items-center min-w-8 p-0' onClick={() => pageUp()}>
                            <ArrowBigUp size={20} />
                        </Button>
                    </StyledToolTip>}
                    {configuration?.pages?.find((ele) => ele.value === "pageDown")?.active && <StyledToolTip content={"Page Down"} placement='bottom'>
                        <Button isIconOnly variant='light' size='sm' className='flex  hover:bg-neutral-300 rounded-sm transition-all duration-200 justify-center items-center min-w-8 p-0' onClick={() => pageDown()}>
                            <ArrowBigUp size={20} className='rotate-180' />
                        </Button>
                    </StyledToolTip>}
                    {configuration?.pages?.find((ele) => ele.value === "pageDuplicate")?.active && <StyledToolTip content={"Page Duplicate"} placement='bottom'>
                        <Button isIconOnly variant='light' size='sm' className='flex  hover:bg-neutral-300 rounded-sm transition-all duration-200 justify-center items-center min-w-8 p-0' onClick={() => pageDuplicate()}>
                            <Copy size={16} />
                        </Button>
                    </StyledToolTip>}
                </div>
                <div className=''>
                    <p className='text-sm font-semibold'>{initialData?.name}</p>
                </div>
                <div className='min-w-52' style={{ visibility: configuration?.others?.find((ele) => ele.value === "scale")?.active ? "visible" : "hidden" }} >
                    <div className='flex flex-row gap-2 items-center'>
                        <div className='px-2 flex flex-row gap-3 items-center'>
                            <StyledToolTip content={"Zoom to 100%"} placement='bottom'>
                                <button onClick={() => setScale(100)}>
                                    <Fullscreen size={16} />
                                </button>
                            </StyledToolTip>
                        </div>
                        <div className='flex flex-col gap-0 w-full justify-center'>
                            <Slider
                                showTooltip={true}
                                step={5}
                                size="sm"
                                value={scale}
                                onChange={setScale}
                                maxValue={200}
                                minValue={50}
                                defaultValue={75}
                                className="max-w-32"
                                renderThumb={(props) => (
                                    <div
                                        {...props}
                                        className="group  top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                                    >
                                        <span className="transition-transform shadow-small  rounded-full w-3 h-3 block group-data-[dragging=true]:scale-80" />
                                    </div>
                                )}
                                startContent={<StyledToolTip content={"Zoom out"} placement='bottom'>
                                    <button disabled={scale <=50} className='p-0.5 bg-black rounded-sm' onClick={() => setScale((prev) => prev - 10)} isIconOnly size='sm'>
                                        <Minus color='#ffffff' strokeWidth={4} size={12} />
                                    </button>
                                </StyledToolTip>}
                                endContent={<StyledToolTip content={"Zoom in"} placement='bottom'>
                                    <button disabled={scale === 200} onClick={() =>
                                        setScale((prev) => prev + 10)
                                    } className='p-0.5 bg-black rounded-sm'>
                                        <Plus color='#ffffff' strokeWidth={4} size={12} />
                                    </button>
                                </StyledToolTip>}
                            />

                        </div>


                    </div>


                </div>
            </div>
        </>
    )
}

export default Toolbar

export const StyledToolTip = ({ children, content, placement = "bottom" }) => {
    return <Tooltip
        className="capitalize"
        classNames={{
            content: [
                "bg-black rounded-sm text-white font-semibold border-none",
            ],
        }} content={content} placement={placement}>
        {children}
    </Tooltip>
}