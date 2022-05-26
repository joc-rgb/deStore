import { React, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Logo } from './Logo';
import Nav from './components/Nav';
import Add from './components/Add';

import { BsThreeDots, BsPlus } from 'react-icons/bs';
function App() {
  const [activeTab, setActiveTab] = useState('');
  return (
    <Box
      textAlign="center"
      fontSize="xl"
      h="100vh"
      p={4}
      position="relative"
      display="flex"
      flexDir="column"
    >
      <Nav />
      <Add />
    </Box>
  );
}

export default App;
