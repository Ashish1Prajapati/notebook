
import { Button, Card, CardBody, CardFooter } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import CreateSpaceModal from '../modals/CreateSpaceModal';
import { useRouter } from 'next/router';
import { shorthandText } from '@/utils/helper';
import Loading from '../loading/loading';
const getData = () => {
    if (typeof window !== "undefined") {
        const data = localStorage.getItem("data");
        if (data) {
            return JSON.parse(data)
        }
        return []
    }
    return []
}
const HomePage = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState([])
    useEffect(() => {
        const alldata = getData()
        setData(alldata)
    }, [])
    const router = useRouter()
    const handleRediret = (id) => {
        router.push(`/whiteboard/${id}`)
    }
    return (
        <div className='p-24 flex flex-col gap-4 items-center justify-center h-screen overflow-auto w-full'>
            <CreateSpaceModal isOpen={isOpen} setIsOpen={setIsOpen} />
            <h1 className='text-3xl font-bold text-center pt-10'>Welcome To Whiteboard App</h1>
            <div className='self-center py-5'>
                <Button onClick={() => setIsOpen(true)} className='bg-primary text-white rounded-md'>Create New Space</Button>
            </div>
            <div className="gap-5 grid grid-cols-2 sm:grid-cols-4">
                {data.map((item, index) => (
                    <Card shadow="sm" className='rounded-sm min-w-64' key={index} isPressable onPress={() => handleRediret(item?.id)}>
                        <CardBody className="overflow-visible p-0">
                            <img
                                alt={item.title}
                                className="w-full object-fill h-[180px]"
                                src={`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtZmlsZS1zcHJlYWRzaGVldCI+PHBhdGggZD0iTTE1IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3WiIvPjxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0Ii8+PHBhdGggZD0iTTggMTNoMiIvPjxwYXRoIGQ9Ik0xNCAxM2gyIi8+PHBhdGggZD0iTTggMTdoMiIvPjxwYXRoIGQ9Ik0xNCAxN2gyIi8+PC9zdmc+`}
                            />
                        </CardBody>
                        <CardFooter className="text-small flex-col items-start">
                            <b className='capitalize'>{shorthandText(item?.name,28)}</b>
                            <p className="text-default-500">{item?.updatedAt || item?.createdAt}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default HomePage
