import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Checkbox,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spacer,
  Textarea,
  useDisclosure,
  useToast,
  Text,
  Box,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';
import { Web3Storage } from 'web3.storage';
import randomatic from 'randomatic';
import cryptoJs from 'crypto-js';

const Add = () => {
  const [FilesData, setFiles] = useState('');
  const [Textfile, setTextFile] = useState('');
  const [Encrypt, setEncrypt] = useState(false);
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileMessage, setfileMessage] = useState('');
  const [textMessage, setTextMessage] = useState('');
  const [decrypt, setDecrypt] = useState(false);
  const [decryptHash, setDecryptHash] = useState('');
  const [decryptPass, setDecryptPass] = useState('');
  const [content, setContent] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setPassword(randomatic('*', 18));
  }, [Encrypt]);

  function getAccessToken() {
    return process.env.REACT_APP_WEB3STORAGE_TOKEN;
  }
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  const toast = useToast();
  const createTextData = async text => {
    const ciphertext = Encrypt
      ? cryptoJs.AES.encrypt(JSON.stringify(text), Password).toString()
      : JSON.stringify(text);
    console.log(ciphertext);
    const file = new File([ciphertext], 'plain.text', { type: 'text/plain' });
    const client = makeStorageClient();
    const cid = await client.put([file]);
    console.log('stored files with cid:', cid);

    toast({
      title: 'Success!',
      description: `Share your hash ${cid}`,
      duration: 100000,
      status: 'success',
      isClosable: true,
    });
    setLoading(false);
    setTextMessage(`https://${cid}.ipfs.dweb.link`);
  };
  async function storeFiles(files) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log('stored files with cid:', cid);
    toast({
      title: 'Success!',
      description: `Share your hash ${cid}`,
      duration: 100000,
      status: 'success',
      isClosable: true,
    });
    setLoading(false);
    setfileMessage(`https://${cid}.ipfs.dweb.link`);
    return cid;
  }
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    console.log(Textfile);
    storeFiles(FilesData);
  };
  const handleTextSubmit = async e => {
    e.preventDefault();
    createTextData(Textfile);
  };

  async function retrieve(cid) {
    console.log(`cid: ${cid}`);
    const client = makeStorageClient();
    const res = await client.get(cid);
    const files = await res.files();
    for (const file of files) {
      console.log(`${file.cid} -- ${file.name} -- ${file.size}`);
    }
    console.log(files[0]);
    console.log(`Got a response! [${res[0]}] ${res.statusText}`);
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`);
    }
    return files[0];
    // request succeeded! do something with the response object here...
  }

  async function readText(f) {
    const reader = new FileReader();
    console.log(f);
    var data;
    reader.addEventListener('load', () => {
      setContent(reader.result);
      if (decrypt) {
        const bytes = cryptoJs.AES.decrypt(reader.result, decryptPass);
        console.log(bytes);
        const oritext = bytes.toString(cryptoJs.enc.Utf8);
        setContent(oritext);
      }
    });
    reader.readAsText(f);
  }
  const handleDecrypt = async e => {
    e.preventDefault();
    const res = await retrieve(decryptHash);

    readText(res).then(() => console.log(content));
  };

  return (
    <Box>
      <Heading fontWeight="thin">Instant Store & Retrieve Data</Heading>
      <Text>No login required!</Text>
      <Spacer p={2} />
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Store</Tab>
          <Tab _selected={{ color: 'white', bg: 'blue.500' }}>
            Retrieve Text
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Accordion>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    All types of Files
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <form onSubmit={handleSubmit}>
                    <FormControl isRequired>
                      <FormLabel htmlFor="desc">Files</FormLabel>
                      <Input
                        type="file"
                        name="file"
                        id="file"
                        onChange={e => setFiles(e.target.files)}
                        multiple
                      />
                    </FormControl>

                    <Button
                      mt={4}
                      colorScheme="teal"
                      type="submit"
                      isLoading={loading}
                      loadingText="Submitting"
                    >
                      Submit
                    </Button>
                  </form>
                  <Spacer p={2} />
                  {FilesData && (
                    <Text fontSize="md">
                      Access your file here:
                      <br />
                      {fileMessage}
                    </Text>
                  )}
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Plain Text/Code Snippet
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <form onSubmit={handleTextSubmit}>
                    <FormControl isRequired>
                      <FormLabel htmlFor="text">
                        Paste/Type your text/code snippets here.
                      </FormLabel>
                      <Textarea
                        id="text"
                        h="200px"
                        type="text"
                        placeholder="Anything..."
                        size="lg"
                        onChange={e => setTextFile(e.target.value)}
                      />
                    </FormControl>
                    <Box>
                      <Checkbox onChange={e => setEncrypt(e.target.checked)}>
                        Set Password
                      </Checkbox>

                      {Encrypt && (
                        <Box>
                          <Text fontWeight="bold">{Password}</Text>
                          <Text fontSize="md">
                            **Please write it down. It will only show once.**
                          </Text>
                        </Box>
                      )}
                    </Box>
                    <Button
                      mt={4}
                      colorScheme="teal"
                      type="submit"
                      isLoading={loading}
                      loadingText="Submitting"
                    >
                      Submit
                    </Button>
                  </form>
                  {textMessage && (
                    <Text fontSize="md">
                      Share your CID <br /> {textMessage}
                    </Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </TabPanel>
          <TabPanel>
            <form onSubmit={handleDecrypt}>
              <FormControl isRequired>
                <FormLabel htmlFor="text">Paste Your CID Here.</FormLabel>
                <Textarea
                  id="text"
                  type="text"
                  placeholder="Anything..."
                  size="lg"
                  onChange={e => setDecryptHash(e.target.value)}
                />
              </FormControl>
              <Box>
                <Checkbox onChange={e => setDecrypt(e.target.checked)}>
                  Password Protected?
                </Checkbox>

                {decrypt && (
                  <Box>
                    <FormLabel htmlFor="text">Enter Password</FormLabel>
                    <Input
                      fontWeight="bold"
                      type="text"
                      name="decrypt"
                      id="decrypt"
                      onChange={e => setDecryptPass(e.target.value)}
                    />
                  </Box>
                )}
              </Box>
              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                isLoading={loading}
                loadingText="Submitting"
              >
                Submit
              </Button>
            </form>
            <Text fontSize="md">Decrypted Text</Text>
            <Box border="1px blue.100 " w="80%" h="100px">
              Text here:
              <Text>{content}</Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Add;
