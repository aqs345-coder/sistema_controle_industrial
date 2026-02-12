# 🏭 Production Control System

Um sistema completo para gerenciamento de insumos, definição de produtos/receitas e planejamento otimizado de produção. O projeto utiliza um algoritmo guloso (Greedy) para sugerir o plano de produção mais rentável com base no estoque atual.

## 🚀 Tecnologias Utilizadas

### Backend
- **Java 17**
- **Quarkus Framework** (Superfast Subatomic Java)
- **Hibernate Panache** (ORM)
- **PostgreSQL** (Banco de Dados)
- **Docker & Docker Compose**

### Frontend
- **React.js** (Vite)
- **TypeScript**
- **Material UI (MUI)**
- **Axios** (Integração API)

---

## ⚙️ Funcionalidades

1.  **Gerenciamento de Matérias-Primas:** Cadastro e controle de estoque de insumos.
2.  **Gerenciamento de Produtos:** Definição de produtos e seus valores de venda.
3.  **Fichas Técnicas (Receitas):** Associação de múltiplos insumos a um produto (Composição).
4.  **Cálculo de Produção (Algoritmo):**
    - O sistema analisa o estoque disponível.
    - Prioriza a fabricação dos produtos com **maior valor de venda** (Estratégia Gulosa).
    - Sugere a quantidade ideal a ser produzida e estima o lucro total.

---

