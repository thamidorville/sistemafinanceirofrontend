"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  FormControl,
  FormLabel,
  Heading,
  useToast,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { jsPDF } from "jspdf";

interface Receita {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
}

export default function Receitas() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number>(0);
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [editandoReceita, setEditandoReceita] = useState<Receita | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [relatorioModalOpen, setRelatorioModalOpen] = useState(false);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  const toast = useToast();

  const fetchReceitas = async () => {
    try {
      const response = await fetch("https://localhost:7173/api/Receitas");
      const data = await response.json();
      setReceitas(data);
    } catch (error) {
      console.error("Erro ao buscar despesas", error);
    }
  };

  useEffect(() => {
    fetchReceitas();
  }, []);

  const gerarRelatorioPDF = async () => {
    try {
      const response = await fetch(
        `https://localhost:7173/api/RelatorioReceitas/periodo?inicio=${inicio}&fim=${fim}`
      );
      const receitasRelatorio = await response.json();

      if (receitasRelatorio.length === 0) {
        toast({
          title: "Nenhuma receita encontrada nesse período.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const doc = new jsPDF();
      doc.text("Relatório de Receitas", 10, 10);
      doc.text(`Período: ${inicio} até ${fim}`, 10, 20);

      let y = 30;
      const lineSpacing = 10;

      const descricaoX = 10;
      const valorX = 70;
      const dataX = 110;
      const categoriaX = 160;

      doc.text("Descrição", descricaoX, y);
      doc.text("Valor", valorX, y);
      doc.text("Data", dataX, y);
      doc.text("Categoria", categoriaX, y);

      y += lineSpacing;

      receitasRelatorio.forEach((receita: Receita) => {
        const descricao = doc.splitTextToSize(`${receita.descricao}`, 50);
        doc.text(descricao, descricaoX, y);
        doc.text(`R$ ${receita.valor.toFixed(2)}`, valorX, y);
        doc.text(`${new Date(receita.data).toLocaleDateString()}`, dataX, y);
        doc.text(`${receita.categoria}`, categoriaX, y);

        y += lineSpacing;
      });

      doc.save(`Relatorio-Receitas-${inicio}-ate-${fim}.pdf`);
      setRelatorioModalOpen(false);
    } catch (error) {
      console.error("Erro ao gerar relatório", error);
      toast({
        title: "Erro ao gerar relatório.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const abrirModalRelatorio = () => {
    setRelatorioModalOpen(true);
  };

  const fecharModalRelatorio = () => {
    setRelatorioModalOpen(false);
  };

  const addReceita = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descricao || !valor || !data || !categoria) {
      toast({
        title: "Todos os campos são obrigatórios.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const receitaData = {
      descricao,
      valor: parseFloat(valor.toLocaleString()),
      data: new Date(data).toISOString(),
      categoria,
    };

    try {
      const response = await fetch("https://localhost:7173/api/Receitas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(receitaData),
      });

      if (response.ok) {
        toast({
          title: "Receita adicionada!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchReceitas();
        setDescricao("");
        setValor(0);
        setData("");
        setCategoria("");
      } else {
        toast({
          title: "Erro ao adicionar receita.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar receita", error);
    }
  };

  const editReceita = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editandoReceita) {
      toast({
        title: "Erro ao editar receita.",
        description: "Nenhuma receita selecionada para edição.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const receitaData = {
      id: editandoReceita.id,
      descricao,
      valor: parseFloat(valor.toString()),
      data: new Date(data).toISOString(),
      categoria,
    };
    try {
      const response = await fetch(
        `https://localhost:7173/api/Receitas/${editandoReceita.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(receitaData),
        }
      );

      if (response.ok) {
        toast({
          title: "Receita editada!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchReceitas();
        fecharModal();
      } else {
        toast({
          title: "Erro ao editar receita.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Erro ao editar receita", error);
    }
  };

  const deleteReceita = async (id: number) => {
    try {
      const response = await fetch(
        `https://localhost:7173/api/Receitas/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Receita excluída!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchReceitas();
      } else {
        toast({
          title: "Erro ao excluir receita.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Erro ao excluir receita", error);
    }
  };

  const abrirModal = (receita: Receita) => {
    setEditandoReceita(receita);
    setDescricao(receita.descricao);
    setValor(receita.valor);
    setData(receita.data.split("T")[0]);
    setCategoria(receita.categoria);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    limparFormulario();
  };

  const limparFormulario = () => {
    setDescricao("");
    setValor(0);
    setData("");
    setCategoria("");
    setEditandoReceita(null);
  };

  const filterReceitas = () => {
    const receitasFiltradas = receitas.filter((receita) =>
      receita.categoria.toLowerCase().includes(filtroCategoria.toLowerCase())
    );
    setReceitas(receitasFiltradas);
  };

  const resetFilter = () => {
    setFiltroCategoria("");
    fetchReceitas();
  };

  return (
    <Box
      py={4}
      my={20}
      p={[4, 8]}
      maxW="900px"
      mx="auto"
      boxShadow="2xl"
      borderRadius="md"
      bg="transparent"
    >
      <Heading as="h1" size="lg" textAlign="center" mb={6}>
        Controle de Receitas
      </Heading>
      <Button
        width={{ base: "100%", md: "200px" }}
        colorScheme="teal"
        mb={6}
        onClick={abrirModalRelatorio}
      >
        Gerar Relatório
      </Button>
      <Modal isOpen={relatorioModalOpen} onClose={fecharModalRelatorio}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gerar Relatório de Receitas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl id="inicio" isRequired>
                <FormLabel>Data de Início</FormLabel>
                <Input
                  type="date"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                />
              </FormControl>
              <FormControl id="fim" isRequired>
                <FormLabel>Data de Fim</FormLabel>
                <Input
                  type="date"
                  value={fim}
                  onChange={(e) => setFim(e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={gerarRelatorioPDF}>
              Gerar Relatório
            </Button>
            <Button variant="ghost" onClick={fecharModalRelatorio}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Stack
        maxW="700px"
        mx="auto"
        p={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        mb={8}
      >
        <FormControl id="descricao" isRequired>
          <FormLabel>Descrição</FormLabel>
          <Input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </FormControl>
        <FormControl id="valor" isRequired>
          <FormLabel>Valor</FormLabel>
          <Input
            placeholder="Valor"
            type="number"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
          />
        </FormControl>
        <FormControl id="data" isRequired>
          <FormLabel>Data</FormLabel>
          <Input
            placeholder="Data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </FormControl>
        <FormControl id="categoria" isRequired>
          <FormLabel>Categoria</FormLabel>
          <Input
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </FormControl>
        <Flex justifyContent="center" mt={4}>
          <Button
            width={{ base: "100%", md: "200px" }}
            colorScheme="teal"
            onClick={addReceita}
          >
            Adicionar Receita
          </Button>
        </Flex>
      </Stack>
      <Stack
        maxW="700px"
        mx="auto"
        p={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        mb={8}
      >
        <FormControl id="filtro">
          <FormLabel>Filtrar por Categoria</FormLabel>
          <Input
            placeholder="Categoria"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          />
        </FormControl>
        <Flex justifyContent="center" mt={4} gap={10}>
          <Button
            width={{ base: "100%", md: "200px" }}
            colorScheme="teal"
            onClick={filterReceitas}
          >
            Filtrar Receitas
          </Button>
          <Button
            width={{ base: "100%", md: "200px" }}
            colorScheme="teal"
            onClick={resetFilter}
          >
            Limpar Filtro
          </Button>
        </Flex>
      </Stack>
      <Box
        maxW="900px"
        mt={8}
        p={4}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        mx="auto"
      >
        {receitas.length > 0 ? (
          <Table
            variant="striped"
            colorScheme="teal"
            width="100%"
            boxSizing="border-box"
          >
            <Thead>
              <Tr bg="teal.500">
                <Th color="white" fontSize="md" textAlign="left">
                  Descrição
                </Th>
                <Th color="white" fontSize="md" textAlign="left">
                  Valor
                </Th>
                <Th color="white" fontSize="md" textAlign="left">
                  Data
                </Th>
                <Th color="white" fontSize="md" textAlign="left">
                  Categoria
                </Th>
                <Th color="white" fontSize="md" textAlign="center">
                  Ações
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {receitas.map((receita) => (
                <Tr key={receita.id} _hover={{ bg: "gray.100" }}>
                  <Td verticalAlign="middle" fontWeight="medium">
                    {receita.descricao}
                  </Td>
                  <Td verticalAlign="middle">
                    <Flex alignItems="center">
                      <Text mr={1}>R$</Text>
                      <Text>{receita.valor.toFixed(2)}</Text>
                    </Flex>
                  </Td>
                  <Td verticalAlign="middle">
                    {new Date(receita.data).toLocaleDateString()}
                  </Td>
                  <Td verticalAlign="middle">{receita.categoria}</Td>
                  <Td verticalAlign="middle" textAlign="center">
                    <Flex justifyContent="center" gap={2}>
                      <Tooltip
                        label="Editar Receita"
                        aria-label="Editar Receita"
                      >
                        <IconButton
                          aria-label="Editar receita"
                          icon={<EditIcon />}
                          colorScheme="yellow"
                          onClick={() => abrirModal(receita)}
                        />
                      </Tooltip>
                      <Tooltip
                        label="Excluir Receita"
                        aria-label="Excluir Receita"
                      >
                        <IconButton
                          aria-label="Excluir receita"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => deleteReceita(receita.id)}
                        />
                      </Tooltip>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text textAlign="center" mt={4}>
            Nenhuma receita encontrada.
          </Text>
        )}
      </Box>
      <Modal isOpen={isModalOpen} onClose={fecharModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Receita</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl id="descricaoEdit" isRequired>
                <FormLabel>Descrição</FormLabel>
                <Input
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FormControl>
              <FormControl id="valorEdit" isRequired>
                <FormLabel>Valor</FormLabel>
                <Input
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(Number(e.target.value))}
                />
              </FormControl>
              <FormControl id="dataEdit" isRequired>
                <FormLabel>Data</FormLabel>
                <Input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </FormControl>
              <FormControl id="categoriaEdit" isRequired>
                <FormLabel>Categoria</FormLabel>
                <Input
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={editReceita}>
              Salvar Alterações
            </Button>
            <Button variant="ghost" onClick={fecharModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
