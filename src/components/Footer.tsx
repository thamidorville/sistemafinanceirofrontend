"use client";

import { Box, Text, Link, IconButton, Flex } from "@chakra-ui/react";
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <Box as="footer" role="contentinfo" py={6} bg="teal.600" color="white">
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        maxW="1200px"
        mx="auto"
        px={4}
      >
        <Text
          fontSize="lg"
          fontWeight="bold"
          textAlign={{ base: "center", md: "center" }}
        >
          Sistema de Gerenciamento Financeiro Pessoal
        </Text>
      </Flex>
      <Flex direction="column" align="center" mt={4} textAlign="center">
        <Text fontSize="sm">
          &copy; {new Date().getFullYear()} Sistema de Gerenciamento Financeiro
          Pessoal. Todos os direitos reservados.
        </Text>
        <Text fontSize="sm" mt={2}>
          Desenvolvido por{" "}
          <Link
            href="https://www.linkedin.com/in/thamirisdorville/"
            isExternal
            _hover={{ textDecoration: "underline" }}
          >
            Thamiris Dorville
          </Link>
          <Link href="https://www.linkedin.com/in/thamirisdorville/" isExternal>
            <IconButton
              aria-label="LinkedIn"
              icon={<FaLinkedin />}
              colorScheme="white"
              variant="ghost"
              size="lg"
              _hover={{ bg: "whiteAlpha.300" }}
            />
          </Link>
        </Text>
      </Flex>
    </Box>
  );
}
