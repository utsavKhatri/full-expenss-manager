
import { dataState } from '@/context';
import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

const AccountShare = ({ id }: { id: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleShareAcc,
    transData,
    shareLoading,
    getShareList,
    shareList,
  } = dataState();

  return (
    <>
      <Button
        onClick={() => getShareList(id, onOpen)}
        colorScheme={useColorModeValue('blackAlpha', 'blue')}
      >
        Share Account
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody
            as={'form'}
            onSubmit={(e) => handleShareAcc(e, id, onClose)}
            display={'flex'}
            flexDirection={'column'}
            gap={3}
          >
            <Text as="b" fontSize="lg">
              Share with the following user:
            </Text>
            <Text fontSize="md">
              Previously shared with:{' '}
              {shareList &&
                shareList?.sharedList.map((v: { name: string }) => {
                  return v.name + ', ';
                })}
            </Text>
            <FormControl>
              {!shareLoading && (
                <Select name="email" placeholder="Select email" size={'md'}>
                  {shareList.users.map((user: any) =>
                    user.id !== transData.owner ? (
                      <option key={user.id} value={user.email}>
                        {user.name}
                      </option>
                    ) : null
                  )}
                </Select>
              )}
            </FormControl>
            <FormControl>
              <Button w={'full'} type="submit" colorScheme="blue">
                Share
              </Button>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AccountShare;
