import React from 'react';
import { ChakraProvider, Heading, extendTheme, Box, defineStyleConfig } from '@chakra-ui/react'
import './App.css';
import { Login } from './login/login';
import { AvailableQs } from './available-qs/available-qs';
import { AssignedQs } from './assigned-qs/assigned-qs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store, { StoreContext } from './stores';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      retry: false,
      cacheTime: 0,
      refetchOnWindowFocus: false
    }
  }
});

const theme = extendTheme({
  components: {
    Button: defineStyleConfig({
      baseStyle: {
        margin: '5px'
      }
    }),
    Heading: defineStyleConfig({
      baseStyle: {
        marginBottom: '20px'
      }
    })
  }
})

function App() {
  return (
    <StoreContext.Provider value={store}>
      <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <Box maxWidth={'1000px'} margin={'0 auto'} padding={'10px'}>
              <Heading size={'2xl'}>Makeshift student centre</Heading>
              <Box display={'flex'} justifyContent={'center'} >
                <Login />
              </Box>
              <AvailableQs />
              <AssignedQs />
            </Box>
          </ChakraProvider>
      </QueryClientProvider>
    </StoreContext.Provider>
  );
}

export default App;
