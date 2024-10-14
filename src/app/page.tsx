"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Heading,
  useToast,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export default function LoginPage() {
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://localhost:7173/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({
          title: "Login realizado com sucesso!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/dashboard");
      } else {
        const data = await response.json();
        toast({
          title: "Erro ao fazer login",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      display="flex"
      bg="gray.50"
      minH="100vh"
      justifyContent="center"
      alignItems="center"
     
    >
      <Box
        display="flex"
        flexDirection={["column", "row"]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        maxW="1200px"
        mx="auto"
        p={[4, 8]}
      >
        <Box
          width={["100%", "60%"]}
          animation={`${fadeIn} 1.5s ease-in-out`}
          mb={[8, 0]}
          mx={[0, 8]}
        >
          <Image
            src="/images/login-foto.png"
            objectFit="cover"
            width="100%"
            borderRadius="md"
            height={["200px", "100%"]}
          />
        </Box>
        <Box
          p={["16px", "32px"]}
          width={["100%", "400px"]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          bg="white"
          boxShadow="lg"
          borderRadius="md"
        >
          <Heading as="h1" size="lg" textAlign="center" mb={6}>
            Login
          </Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Button colorScheme="teal" type="submit">
                Entrar
              </Button>
            </Stack>
          </form>
          <Text fontSize="sm" textAlign="center" mt={4} letterSpacing="normal">
            Não tem uma conta?{" "}
            <Link href="/registro" color="teal.500">
              Crie seu cadastro
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
