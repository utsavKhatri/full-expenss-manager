
import { dataState } from '@/context';
import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';


const AddBalance = ({ accID }: { accID: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { updateAccData } = dataState();
  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={useColorModeValue('whatsapp', 'green')}
        leftIcon={<PlusSquareIcon />}
      >
        Add Balance
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add balance</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            as={'form'}
            onSubmit={(e) => updateAccData(e,accID, onClose)}
          >
            <Stack direction={'column'}>
              <FormControl isRequired>
                <FormLabel>Balance</FormLabel>
                <Input required placeholder="Enter balance" name="balance" />
              </FormControl>
              <Button
                w={'full'}
                _hover={{
                  backgroundColor: 'blue.500',
                  color: 'white',
                }}
                type="submit"
                variant={'outline'}
              >
                Add
              </Button>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddBalance;
