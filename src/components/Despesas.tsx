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

interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
}

export default function Despesas() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number>(0);
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [editandoDespesa, setEditandoDespesa] = useState<Despesa | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [relatorioModalOpen, setRelatorioModalOpen] = useState(false);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const toast = useToast();

  const fetchDespesas = async () => {
    try {
      const response = await fetch("https://localhost:7173/api/Despesas");
      const data = await response.json();
      setDespesas(data);
    } catch (error) {
      console.error("Erro ao buscar despesas", error);
    }
  };

  useEffect(() => {
    fetchDespesas();
  }, []);

  const gerarRelatorioPDF = async () => {
    try {
      const response = await fetch(
        `https://localhost:7173/api/RelatorioDespesas/periodo?inicio=${inicio}&fim=${fim}`
      );
      const despesasRelatorio = await response.json();

      if (despesasRelatorio.length === 0) {
        toast({
          title: "Nenhuma despesa encontrada nesse período.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const doc = new jsPDF();
      doc.text("Relatório de Despesas", 10, 10);
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

      despesasRelatorio.forEach((despesa: Despesa) => {
        const descricao = doc.splitTextToSize(`${despesa.descricao}`, 50);
        doc.text(descricao, descricaoX, y);
        doc.text(`R$ ${despesa.valor.toFixed(2)}`, valorX, y);
        doc.text(`${new Date(despesa.data).toLocaleDateString()}`, dataX, y);
        doc.text(`${despesa.categoria}`, categoriaX, y);

        y += lineSpacing;
      });

      doc.save(`Relatorio-Despesas-${inicio}-ate-${fim}.pdf`);
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

  const addDespesa = async (e: React.FormEvent) => {
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

    const despesaData = {
      descricao,
      valor: parseFloat(valor.toLocaleString()),
      data: new Date(data).toISOString(),
      categoria,
    };

    try {
      const response = await fetch("https://localhost:7173/api/Despesas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(despesaData),
      });

      if (response.ok) {
        toast({
          title: "Despesa adicionada!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchDespesas();
        setDescricao("");
        setValor(0);
        setData("");
        setCategoria("");
      } else {
        toast({
          title: "Erro ao adicionar despesa.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar despesa", error);
    }
  };

  const editDespesa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editandoDespesa) {
      toast({
        title: "Erro ao editar despesa.",
        description: "Nenhuma despesa selecionada para edição.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const despesaData = {
      id: editandoDespesa.id,
      descricao,
      valor: parseFloat(valor.toString()),
      data: new Date(data).toISOString(),
      categoria,
    };
    try {
      const response = await fetch(
        `https://localhost:7173/api/Despesas/${editandoDespesa.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(despesaData),
        }
      );

      if (response.ok) {
        toast({
          title: "Despesa editada!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchDespesas();
        fecharModal();
      } else {
        toast({
          title: "Erro ao editar despesa.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Erro ao editar despesa", error);
    }
  };

  const deleteDespesa = async (id: number) => {
    try {
      const response = await fetch(
        `https://localhost:7173/api/Despesas/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Despesa excluída!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchDespesas();
      } else {
        toast({
          title: "Erro ao excluir despesa.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Erro ao excluir despesa", error);
    }
  };

  const abrirModal = (despesa: Despesa) => {
    setEditandoDespesa(despesa);
    setDescricao(despesa.descricao);
    setValor(despesa.valor);
    setData(despesa.data.split("T")[0]);
    setCategoria(despesa.categoria);
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
    setEditandoDespesa(null);
  };

  const filterDespesas = () => {
    const despesasFiltradas = despesas.filter((despesa) =>
      despesa.categoria.toLowerCase().includes(filtroCategoria.toLowerCase())
    );
    setDespesas(despesasFiltradas);
  };

  const resetFilter = () => {
    setFiltroCategoria("");
    fetchDespesas();
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
        Controle de Despesas
      </Heading>

      <Button
        width={{ base: "100%", md: "200px" }}
        mx="auto"
        colorScheme="teal"
        mb={6}
        onClick={abrirModalRelatorio}
      >
        Gerar Relatório
      </Button>

      <Modal isOpen={relatorioModalOpen} onClose={fecharModalRelatorio}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gerar Relatório de Despesas</ModalHeader>
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
            onClick={addDespesa}
          >
            Adicionar Despesa
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
            onClick={filterDespesas}
          >
            Filtrar Despesas
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
        {despesas.length > 0 ? (
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
              {despesas.map((despesa) => (
                <Tr key={despesa.id} _hover={{ bg: "gray.100" }}>
                  <Td verticalAlign="middle" fontWeight="medium">
                    {despesa.descricao}
                  </Td>
                  <Td verticalAlign="middle">
                    <Flex alignItems="center">
                      <Text mr={1}>R$</Text>
                      <Text>{despesa.valor.toFixed(2)}</Text>
                    </Flex>
                  </Td>
                  <Td verticalAlign="middle">
                    {new Date(despesa.data).toLocaleDateString()}
                  </Td>
                  <Td verticalAlign="middle">{despesa.categoria}</Td>
                  <Td verticalAlign="middle" textAlign="center">
                    <Flex justifyContent="center" gap={2}>
                      <Tooltip
                        label="Editar Despesa"
                        aria-label="Editar Despesa"
                      >
                        <IconButton
                          aria-label="Editar despesa"
                          icon={<EditIcon />}
                          colorScheme="yellow"
                          onClick={() => abrirModal(despesa)}
                        />
                      </Tooltip>
                      <Tooltip
                        label="Excluir Despesa"
                        aria-label="Excluir Despesa"
                      >
                        <IconButton
                          aria-label="Excluir despesa"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => deleteDespesa(despesa.id)}
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
            Nenhuma despesa encontrada.
          </Text>
        )}
      </Box>
      <Modal isOpen={isModalOpen} onClose={fecharModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Despesa</ModalHeader>
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
            <Button colorScheme="teal" onClick={editDespesa}>
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
