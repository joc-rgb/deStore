import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme(
  {
    fonts: {
      body: 'Courier Prime, monospace',
      heading: 'Courier Prime, monospace',
    },
  },
  { config }
);

export default theme;
