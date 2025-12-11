# 🏆 Dashboard de Ranking de Vendas Donna Negociações Imobiliárias

Dashboard de ranking (leaderboard) integrado ao CRM Imoview com gamificação e feedback visual/sonoro.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Shadcn/UI
- **State/Data Fetching:** TanStack Query (React Query)
- **API Client:** Axios (com Interceptors)
- **Sons:** Howler.js
- **Animações:** Framer Motion

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto (já existe um exemplo):

```env
NEXT_PUBLIC_IMOVIEW_API_KEY=sua_api_key_aqui
USE_MOCK_DATA=true
NEXT_PUBLIC_IMOVIEW_BASE_URL=https://api.imoview.com.br/
```

**Importante:** 
- Se `USE_MOCK_DATA=true`, o sistema usará dados simulados (útil para desenvolvimento sem API Key)
- Se `USE_MOCK_DATA=false`, você precisa de uma API Key válida do Imoview

3. Adicione o arquivo de som:

Coloque um arquivo `cash-register.mp3` em `/public/sounds/`. Você pode baixar de sites como:
- [Freesound](https://freesound.org)
- [Mixkit](https://mixkit.co)
- [Zapsplat](https://zapsplat.com)

4. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🎯 Funcionalidades

### Ranking e Metas
- Filtros de período: Semanal, Mensal, Bimestral, Trimestral, Semestral, Anual
- Cálculo automático de valor total (R$) e quantidade de vendas por corretor

### Interface Visual
- **Top 3:** Pódio com design de Ouro, Prata e Bronze
- **Lista:** Classificação do 4º lugar em diante com formato zebrado
- Cards mostram: Posição, Foto, Nome, Valor Total (formatado pt-BR), Quantidade de Vendas

### Gamificação
- Som de caixa registradora ao carregar a página
- **Polling:** Consulta automática à API a cada 60 segundos
- Detecção de novas vendas com notificação e som

## 🏗️ Estrutura do Projeto

```
ranking/
├── app/
│   ├── layout.tsx          # Layout principal com Providers
│   ├── page.tsx             # Página principal do ranking
│   └── globals.css          # Estilos globais e tema dark
├── components/
│   ├── ui/                  # Componentes Shadcn/UI
│   ├── period-filter.tsx    # Filtro de períodos
│   ├── podium.tsx           # Componente do pódio (Top 3)
│   ├── ranking-list.tsx     # Lista de ranking
│   └── providers.tsx         # Providers (React Query)
├── lib/
│   ├── services/
│   │   └── imoview.ts       # Service layer com adapter pattern
│   ├── hooks/
│   │   ├── use-ranking.ts   # Hook para buscar e calcular ranking
│   │   └── use-sound.ts     # Hook para tocar som de caixa
│   ├── types.ts             # Tipos TypeScript
│   └── utils.ts             # Funções utilitárias
├── hooks/
│   └── use-toast.ts         # Hook para notificações
└── public/
    └── sounds/
        └── cash-register.mp3 # Som de caixa registradora
```

## 🔌 Integração com Imoview API

### Service Layer

O arquivo `lib/services/imoview.ts` implementa:

- **Adapter Pattern:** Transforma dados brutos da API (PascalCase) em formato interno limpo
- **Mock Mode:** Dados simulados quando `USE_MOCK_DATA=true`
- **Cliente Axios:** Configurado com header `chave` para autenticação

### Endpoints Utilizados

- `GET /Usuario/App_RetornarCorretores` - Lista de corretores
- `GET /Venda/RetornarVendas` - Lista de vendas (com filtros de data)

## 🎨 Design System

- **Tema:** Dark mode com acentos em Verde (sucesso) e Dourado
- **Fonte:** Inter (via Next.js Google Fonts)
- **Animações:** Framer Motion para transições suaves

## 📝 Notas de Desenvolvimento

- O sistema detecta mudanças nos dados comparando hashes simples
- Em produção, considere implementar WebSockets para atualizações em tempo real
- O som de caixa registradora é opcional (fallback silencioso se não carregar)

## 🚀 Build para Produção

```bash
npm run build
npm start
```

## 📄 Licença

Este projeto é privado e proprietário.

