import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Privateroutes from "./components/ptivateroutes";
import AuthProvider from "../../context";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ChakraProvider toastOptions={{ defaultOptions: { position: 'top' } }}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}
