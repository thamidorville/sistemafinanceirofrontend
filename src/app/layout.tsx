import type { Metadata } from "next";
import "./styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react"
import theme from "./theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";



export const metadata: Metadata = {
  title: "Gerenciamento Financeiro",
  description: "Sistema de Gerenciamento Financeiro Pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          <Header/>
        {children}
        <Footer/>
        </ChakraProvider>
      </body>
    </html>
  );
}
