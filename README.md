# Sistema de Gerenciamento Financeiro Pessoal

Este é um sistema de **Gerenciamento Financeiro Pessoal** desenvolvido com **React** e **TypeScript**, utilizando **Chakra UI** para o design da interface. O projeto tem como objetivo permitir a gestão de receitas e despesas, além de exibir gráficos detalhados sobre o desempenho financeiro mensal.

## Funcionalidades

- Exibição de gráficos de **despesas mensais**, **receitas mensais** e **resumo mensal**.
- Permite **adicionar, editar, excluir e filtrar** receitas e despesas.
- **Geração de relatórios** com lista de despesas e receitas por período.
- Design responsivo utilizando **Chakra UI**.
- Desenvolvido com **React TypeScript Next.js**.

## Tecnologias Utilizadas
- **Next.js** (framework React para server-side rendering e rotas avançadas)
- **React** (com TypeScript)
- **Chakra UI** (para estilização)
- **React ChartJS 2** (para gráficos)
- **Axios** (para requisições HTTP)
- **Git** (controle de versão)

## Projeto Back End: https://github.com/thamidorville/sistemafinanceirobackend

## Como Clonar o Repositório

Abra o terminal e execute o seguinte comando para clonar o repositório:

   ```bash
   git clone https://github.com/thamidorville/sistemafinanceirofrontend.git
   cd sistema-financeiro-frontend

## Como Rodar o Projeto
Pré-requisitos
Antes de rodar o projeto, você precisa ter o Node.js instalado. Se ainda não tiver, você pode baixar e instalar a partir do: 
https://nodejs.org/en/download/prebuilt-installer

** Configurar o Arquivo .env.local no 
Ao clonar o projeto frontend, o arquivo .env.local não será baixado porque está incluído no .gitignore. Portanto, crie um arquivo .env.local na raiz do seu projeto frontend e adicione a seguinte linha:
`` NEXT_PUBLIC_API_URL=http://localhost:5057

** Configurar a Porta do Swagger na API back end: https://github.com/thamidorville/sistemafinanceirobackend
No projeto backend, ajuste a porta do Swagger no arquivo launchSettings.json.
O Swagger não roda junto com o dotnet run no Visual Studio,
então ajuste o launchSettings.json para a seguinte configuração:

`` "launchUrl": "swagger",
"applicationUrl": "http://localhost:5058"

## Instalação
yarn install

## Iniciar o servidor de desenvolvimento
yarn dev

O projeto estará rodando no endereço: http://localhost:3000.
