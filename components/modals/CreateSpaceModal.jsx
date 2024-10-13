import { config } from '@/contants/config'
import { getLocalTimeZone, parseAbsoluteToLocal, today } from '@internationalized/date'
import { Accordion, AccordionItem, Button, Checkbox, DateInput, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch } from '@nextui-org/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
const CreateSpaceModal = ({ isOpen, setIsOpen }) => {
    const onClose = () => {
        setIsOpen(false)
    }
    const [configuration, setConfiguration] = useState(config[0])
    const [value, setValue] = useState("");
    const [examDuration, setExamDuration] = useState()
    const router = useRouter()
    const [date, setDate] = useState(parseAbsoluteToLocal(new Date().toISOString()))
    const handleCreateSpace = () => {
        const id = crypto.randomUUID()
        const pageToAdd = Array.from({ length: Number(pages || 1) }, (_, index) => {
            return {
                pageNo: index + 1,
                id: crypto.randomUUID(),
                layout: "/images/ruled.png"
            };
        });
        let config = configuration
        if (config.mode === "Exam") {
            config = {
                ...config,
                examDuration: examDuration,
                examDate: date
            }
        }
        const newSpace = {
            id: id,
            name: value || `space-${id}`,
            createdAt: new Date().toLocaleDateString(),
            pages: pageToAdd,
            options: {
                strokeWidth: 3,
                strokeColor: "black"
            },
            elements: [],
            config: config
        }
        let list = []
        const saved = localStorage.getItem("data")
        const parsedData = JSON.parse(saved);
        if (parsedData) {
            list = [...parsedData]
        }
        list.push(newSpace)
        localStorage.setItem("data", JSON.stringify(list))
        onClose()
        router.push(`/whiteboard/${newSpace.id}`)
    }
    const [pages, setPages] = useState(1)
    const [mode, setMode] = useState("Normal")
    const handleChangeMode = (value) => {
        const selectedMode = config.find((el) => el.mode === value)
        if (selectedMode) {
            setConfiguration(selectedMode)
            setPages(selectedMode.config.pages[0].value)
            if (selectedMode.mode === "Exam") {
                setExamDuration(selectedMode.config?.exam[0].value)
            }
            setMode(value)
        }
    }
    const handleActiveness = (type, title, value) => {
        console.log(title)
        console.log(value)
        const configKey = Object.keys(configuration.config).find((key) => key === type);
        if (configKey) {
            const updatedConfig = {
                ...configuration.config,
                [configKey]: configuration.config[configKey].map((item) =>
                    item.title === title ? { ...item, active: value } : item
                )
            };
            setConfiguration({
                ...configuration,
                config: updatedConfig,
            });
        } else {
            console.error(`Type "${type}" not found in configuration.`);
        }
    };
    return (
        <Modal
            size={"2xl"}
            className='rounded-md  overflow-y-auto'
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Create New Space</ModalHeader>
                <ModalBody>
                    <Input
                        placeholder={configuration.inputTitle}
                        value={value}
                        onValueChange={setValue}
                        variant='bordered' radius='sm'
                    />
                    {/* <div className='flex flex-row justify-between pt-2 px-2 items-center'>
                        <h1 className='font-semibold text-[17px]'>Select Mode</h1>
                        <Select
                            size='sm'
                            label=""
                            radius='none'
                            selectedKeys={[mode]}
                            onChange={(e) => handleChangeMode(e.target.value)}
                            className="max-w-52 "
                        >
                            {config.map((item) => (
                                <SelectItem key={item.mode}>
                                    {item.mode}
                                </SelectItem>
                            ))}
                        </Select>
                    </div> */}
                    <Accordion>
                        <AccordionItem className='font-semibold ' key="1" aria-label="Accordion 1" title="Pages">
                            < div className='flex flex-col gap-1'>
                                {
                                    configuration.config.pages.map((el) => {
                                        return (
                                            <div key={el.value} className='flex flex-row justify-between items-center relative'>
                                                <h5 className='text-sm font-semibold capitalize'>{el.title}</h5>
                                                {
                                                    el.type ? <input value={pages} min={1} max={100} onChange={(e) => { setPages(e.target.value) }
                                                    } className='w-12 rounded-sm pl-1 border-2  hover:border-neutral-400' type='Number' />
                                                        :
                                                        <Switch isSelected={el.active} onValueChange={(value) => handleActiveness("pages", el.title, value)} defaultSelected={el.active} className='flex justify-center w-full scale-75' size="sm"></Switch>
                                                }

                                            </div>
                                        );
                                    })
                                }
                            </div>

                        </AccordionItem>
                        <AccordionItem className='font-semibold' key="2" aria-label="Accordion 1" title="Tools">
                            < div className='flex flex-col gap-1'>
                                {
                                    configuration.config.tools.map((el) => {
                                        return (
                                            <div key={el.value} className='flex flex-row justify-between items-center relative'>
                                                <h5 className='text-sm font-semibold capitalize'>{el.title}</h5>
                                                <Switch isSelected={el.active} onValueChange={(value) => handleActiveness("tools", el.title, value)} isDisabled={el.value === "pencil"} defaultSelected={el.active} className='flex justify-center w-full scale-75' size="sm"></Switch>
                                            </div>
                                        );
                                    })
                                }
                            </div>

                        </AccordionItem>
                        <AccordionItem className='font-semibold' key="3" aria-label="Accordion 1" title="Colors">
                            <div className='grid grid-cols-3 gap-2'>
                                {
                                    configuration.config.colors.map((el) => {
                                        return (
                                            <Checkbox isSelected={el.active} onValueChange={(value) => handleActiveness("colors", el.title, value)} isDisabled={el.value === "#000000"} size='sm' color='primary' radius='none' key={el.value} value={el.value}>
                                                <div className='capitalize'>{el.title}</div>
                                            </Checkbox>
                                        );
                                    })
                                }
                            </div>
                        </AccordionItem>
                        <AccordionItem className='font-semibold' key="4" aria-label="Accordion 2" title="Stroke">

                            <div className='grid grid-cols-2 gap-2'>
                                {
                                    configuration.config.strockWidth.map((el) => {
                                        return (
                                            <Checkbox isSelected={el.active} onValueChange={(value) => handleActiveness("strockWidth", el.title, value)} isDisabled={el.title === "Fine"} size='sm' color='primary' radius='none' key={el.value} value={el.value}>
                                                <div>{el.title}</div>
                                            </Checkbox>
                                        );
                                    })
                                }
                            </div>
                        </AccordionItem>
                        <AccordionItem className='font-semibold' key="5" aria-label="Accordion 3" title="Others">
                            < div className='flex flex-col gap-1'>
                                {
                                    configuration.config.others.map((el) => {
                                        return (
                                            <div key={el.value} className='flex flex-row justify-between items-center relative'>
                                                <h5 className='text-sm font-semibold capitalize'>{el.title}</h5>
                                                <Switch isSelected={el.active} onValueChange={(value) => handleActiveness("others", el.title, value)} isDisabled={el.value === "save"} defaultSelected={el.active} className='flex justify-center w-full scale-75' size="sm"></Switch>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </AccordionItem>
                    </Accordion>
                    {configuration?.mode === "Exam" &&
                        <div className='grid grid-cols-2 gap-1'>
                            <div className='flex flex-col gap-1 px-2'>
                                <h1 className='font-semibold text-medium'>Exam Duration</h1>
                                <Select
                                    size='sm'
                                    label=""
                                    radius='none'
                                    selectedKeys={[examDuration]}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (value) {
                                            setExamDuration(value)
                                        }
                                    }
                                    }
                                    className="max-w-52 "
                                >
                                    {configuration?.config?.exam.map((item) => (
                                        <SelectItem key={item.value}>
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className='flex flex-col px-2 gap-1'>
                                <h1 className='font-semibold text-medium'>Exam Date/Time</h1>
                                <DateInput
                                    size='sm'
                                    radius='none'
                                    granularity="minute"
                                    value={date}
                                    minValue={today(getLocalTimeZone())}
                                    onChange={setDate}
                                />
                            </div>
                        </div>
                    }
                </ModalBody>
                <ModalFooter className='justify-between'>
                    <Button size='sm' className='rounded-md' color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button size='sm' className='rounded-md' color="primary" onPress={() => handleCreateSpace()}>
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CreateSpaceModal
