# 🏭 Industrial Production Control System

Um sistema **Full-Stack** robusto para planejamento e controle de produção industrial (PCP). A solução gerencia estoques de matéria-prima, engenharia de produtos (fichas técnicas) e utiliza um **Algoritmo de Otimização (Greedy)** para sugerir o plano de produção mais rentável, oferecendo dashboards de Business Intelligence em tempo real.

![Status](https://img.shields.io/badge/Status-Completed-success) ![Java](https://img.shields.io/badge/Java-17-orange) ![React](https://img.shields.io/badge/React-18-blue)

## 🚀 Tecnologias Utilizadas

### Backend (API REST)
- **Java 17**
- **Quarkus Framework** (Supersonic Subatomic Java)
- **Hibernate Panache** (JPA/ORM Otimizado)
- **PostgreSQL** (Banco de Dados Relacional)
- **Docker & Docker Compose** (Containerização)

### Frontend (SPA)
- **React.js** (Vite)
- **TypeScript** (Tipagem Estática)
- **Material UI (MUI v5)** (Design System Enterprise)
- **Axios** (Comunicação HTTP)

---

## ⚙️ Funcionalidades Principais

### 1. 📦 Gestão de Estoque (Raw Materials)
- Cadastro e controle de quantidade de insumos.
- **Modo Admin:** Permite edição e exclusão de materiais (com validação de integridade referencial - não permite excluir materiais em uso).

### 2. 🛠️ Engenharia de Produto (Product Engineering)
- Cadastro de produtos e definição de valor de venda.
- **Gestão de Receitas (Bill of Materials):** Interface inline para adicionar/remover ingredientes de um produto.
- Visualização clara de custos e dependências.

### 3. 📊 Dashboard de Business Intelligence (Live Insights)
- Painel lateral fixo que monitora o **Lucro Potencial** em tempo real.
- Exibe a estratégia de otimização atual baseada no estoque existente.
- Atualização automática a cada 5 segundos.

### 4. 🧠 Planejamento & Simulação (AI Optimization)
- **Algoritmo Guloso (Greedy):** Prioriza a produção de itens com maior valor agregado até esgotar o gargalo (insumo limitante).
- **Simulador de Produção:** Ferramenta exclusiva para Administradores que projeta o resultado financeiro e o consumo de materiais sem afetar o banco de dados real.
- Relatório detalhado de "Uso vs. Sobra" de materiais.

### 5. 🛡️ Controle de Acesso (Simulado)
- **Switch "Admin Mode":** Alternância dinâmica entre perfil de "Visualizador" e "Gerente".
- Libera ações críticas (Delete/Edit/Simulate) apenas quando autorizado.

---

## 🎨 Layout & UX

O projeto conta com um layout moderno **Full-Screen**:
- **Sidebar Fixa:** Navegação intuitiva entre módulos.
- **Fluid Grid:** O conteúdo central se adapta a qualquer tamanho de tela.
- **Smart Panels:** O Dashboard de BI desaparece automaticamente na tela de "Production Plan" para dar foco total aos dados da tabela detalhada.

---

## 📐 Detalhes da Arquitetura

### Estrutura de Pastas
```text
/
├── docker-compose.yaml         # Configuração do Banco de Dados
├── production-control-api/     # Backend (Quarkus)
│   └── src/main/java/com/industry/
│       ├── model/              # Entidades (Product, RawMaterial)
│       ├── dto/                # Transferência de Dados (Requests/Responses)
│       ├── resource/           # Controllers REST (API Endpoints)
│       └── service/            # Regras de Negócio e Algoritmos
└── production-control-front/   # Frontend (React)
    └── src/
        ├── components/         # Telas (Manager, Dashboard, Calculator)
        └── services/           # Configuração do Axios (API)
---

## 📝 Licença
Este projeto foi desenvolvido para fins educacionais e de demonstração técnica.