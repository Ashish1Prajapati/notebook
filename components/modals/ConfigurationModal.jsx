import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'

const ConfigurationModal = ({ isOpen, setIsOpen }) => {
    const onClose = () => {
        setIsOpen(false)
    }
    return (
        <Modal
            size={"xl"}
            className='rounded-md min-h-[70vh]'
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Configuration</ModalHeader>
                <ModalBody>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam pulvinar risus non risus hendrerit venenatis.
                        Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam pulvinar risus non risus hendrerit venenatis.
                        Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                        Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                        dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
                        Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                    </p>
                </ModalBody>
                <ModalFooter className='justify-between'>
                    <Button size='sm' className='rounded-md' color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button size='sm' className='rounded-md' color="primary" onPress={onClose}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ConfigurationModal
