import { Box, Button, Heading, Spacer } from '@chakra-ui/react';
import React from 'react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

const Nav = () => {
  return (
    <Box w="100%" display="flex">
      <Heading ml="4">D3$t0r3</Heading>
      <Spacer />

      <ColorModeSwitcher justifySelf="flex-end" />
    </Box>
  );
};

export default Nav;
