import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { BsThreeDots, BsPlus } from 'react-icons/bs';
import { React, useState } from 'react';
import { Web3Storage } from 'web3.storage';

const AddFiles = () => {
  const [file, setFile] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  function getAccessToken() {
    return process.env.REACT_APP_WEB3STORAGE_TOKEN;
  }
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }
  const saveFile = async f => {
    console.log(f.files);
    const client = makeStorageClient();
    const cid = await client.put(f);
    console.log('stored files with cid:', cid);
    return cid;
  };
  const handleSubmit = async e => {
    e.preventDefault();
  };

  return (
    <>
      <Button mt={4} onClick={onOpen}>
        Open Modal
      </Button>
      <Modal
        isCentered
        onFileClose={onClose}
        isFileOpen={isOpen}
        motionPreset="slideInBottom"
        size="full"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading fontWeight="thin">Upload Files</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel htmlFor="file">Cover Image</FormLabel>
                <Input
                  type="file"
                  name="file"
                  id="file"
                  onChange={e => setFile(e.target.files)}
                  multiple
                />
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddFiles;
