"use client"; 

import { Box, Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ResumoMensal {
  mes: string;
  totalDespesas: number;
  totalReceitas: number;
}

export default function GraficosMensais() {
  const [resumoMensal, setResumoMensal] = useState<ResumoMensal[]>([]);

  const fetchResumoMensal = async () => {
    try {
      const response = await fetch("https://localhost:7173/api/Grafico/resumo-mensal");
      const data = await response.json();
      console.log("Resumo mensal:", data);
      setResumoMensal(data);
    } catch (error) {
      console.error("Erro ao buscar resumo mensal", error);
    }
  };

  useEffect(() => {
    fetchResumoMensal();
  }, []);

  if (resumoMensal.length === 0) {
    return <Heading textAlign="center">Sem dados para exibir os gráficos.</Heading>;
  }

  const receitasData = {
    labels: resumoMensal.map((item) => item.mes), 
    datasets: [
      {
        label: "Receitas Mensais",
        data: resumoMensal.map((item) => item.totalReceitas),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const despesasData = {
    labels: resumoMensal.map((item) => item.mes), 
    datasets: [
      {
        label: "Despesas Mensais",
        data: resumoMensal.map((item) => item.totalDespesas), 
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const resumoData = {
    labels: resumoMensal.map((item) => item.mes),
    datasets: [
      {
        label: "Despesas Mensais",
        data: resumoMensal.map((item) => item.totalDespesas),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Receitas Mensais",
        data: resumoMensal.map((item) => item.totalReceitas),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        <Box>
          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Receitas Mensais
          </Heading>
          <Box w="100%" h="400px">
            <Bar
              data={receitasData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: { beginAtZero: true },
                  y: { beginAtZero: true },
                },
                plugins: {
                  legend: { position: "top" },
                },
              }}
            />
          </Box>
        </Box>
        <Box>
          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Despesas Mensais
          </Heading>
          <Box w="100%" h="400px">
            <Bar
              data={despesasData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: { beginAtZero: true },
                  y: { beginAtZero: true },
                },
                plugins: {
                  legend: { position: "top" },
                },
              }}
            />
          </Box>
        </Box>
        <Box>
          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Resumo Mensal
          </Heading>
          <Box w="100%" h="400px">
            <Bar
              data={resumoData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: { beginAtZero: true },
                  y: { beginAtZero: true },
                },
                plugins: {
                  legend: { position: "top" },
                },
              }}
            />
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

