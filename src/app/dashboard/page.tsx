"use client";

import Despesas from "@/components/Despesas";
import GraficosMensais from "@/components/GraficosMensais";
import Receitas from "@/components/Receitas";
import { Box, Flex } from "@chakra-ui/react";

export default function DashboardPage() {
  return (
    <Flex direction='column'>
      <GraficosMensais/>
    <Flex direction="row" justify="space-between" gap={4} padding={4}>
      <Box flex="1">
        <Despesas />
      </Box>
      <Box flex="1">
        <Receitas />
      </Box>
    </Flex>
    </Flex>
  );
}
