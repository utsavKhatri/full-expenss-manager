import { dataState } from '@/context';
import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

const AddAccModal = () => {
  const { handleCreateAccount } = dataState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} leftIcon={<AddIcon />}>
        new account
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={useColorModeValue('gray.100', 'gray.900')}>
          <ModalHeader>create new account</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            as={'form'}
            onSubmit={(e) => handleCreateAccount(e, onClose)}
            display={'flex'}
            flexDirection={'column'}
            gap={3}
            bg={useColorModeValue('gray.100', 'gray.900')}
          >
            <Input placeholder="account name" name="accName" />
            <Button type="submit">Create</Button>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddAccModal;
