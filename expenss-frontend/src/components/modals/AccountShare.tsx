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
  const { handleShareAcc, transData, shareLoading, getShareList, shareList } =
    dataState();

  return (
    <>
      <Button
        onClick={() => getShareList(id, onOpen)}
        width={{ base: 'full', md: 'auto' }}
        boxShadow={'lg'}
        bg={useColorModeValue('#393939', '#0065b9')}
        color={'white'}
      >
        Share Account
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={useColorModeValue('gray.100', 'gray.900')}>
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
                shareList.sharedList.length > 0 &&
                shareList.sharedList.map(
                  (v: { name: string }, index: number) => {
                    if (index === shareList.sharedList.length - 1) {
                      return v.name;
                    }
                    return `${v.name}, `;
                  }
                )}
            </Text>
            <FormControl>
              {!shareLoading && (
                <Select name="email" placeholder="Select email" size="md">
                  {shareList.users.map((user: any) => {
                    if (
                      user.id !== transData.owner &&
                      !shareList.sharedList.some(
                        (sharedUser: { id: string }) =>
                          sharedUser.id === user.id
                      )
                    ) {
                      return (
                        <option key={user.id} value={user.email}>
                          {user.name}
                        </option>
                      );
                    }
                    return null;
                  })}
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
