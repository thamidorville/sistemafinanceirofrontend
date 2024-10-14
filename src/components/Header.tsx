"use client";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { TbPigMoney } from "react-icons/tb";


export default function Header() {
  return (
    <Flex
      as="header"
      width="100%"
      height={{base: "60px", md: "80px"}}
      backgroundColor="teal.500"
      color="white"
      align="center"
      justify="center"
      padding={{ base: "0 20px", md: "0 40px"}}
    >
      <Flex align='center'>
      <Icon as={TbPigMoney} boxSize={{ base: 5, md: 8}} marginRight={4} />
      <Text fontSize={{base: "md", md: "xl"}} fontWeight="bold">
        Sistema de Gerenciamento Financeiro Pessoal
      </Text>
    </Flex>
    </Flex>
  );
}
