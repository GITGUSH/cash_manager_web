# Cash Manager — Frontend

Interface web do sistema de controle financeiro pessoal, desenvolvida com **HTML, CSS, JavaScript** e **Bootstrap 5**.

---

## Sobre o projeto

O Cash Manager Web é o frontend do sistema Cash Manager. Consome a API REST do backend para oferecer uma interface completa de gerenciamento financeiro pessoal, com autenticação via JWT e navegação entre telas.

> 🔗 Repositório do backend: [cash-manager](https://github.com/GITGUSH/cash-manager)

---

## Tecnologias utilizadas

| Tecnologia | Função |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização |
| JavaScript | Lógica e consumo da API |
| Bootstrap 5 | Componentes visuais e responsividade |
| LocalStorage | Armazenamento do token JWT |
| Fetch API | Requisições HTTP para o backend |

---

## Estrutura do projeto

```
cash_manager_web/
├── index.html          — tela de login
├── cadastro.html       — tela de cadastro
├── dashboard.html      — painel principal
├── contas.html         — gerenciamento de contas
├── categorias.html     — gerenciamento de categorias
├── operacoes.html      — gerenciamento de operações 
└── js/
    ├── config.js       — URL base da API (não sobe pro GitHub)
    ├── auth.js         — lógica de login
    ├── cadastro.js     — lógica de cadastro
    ├── dashboard.js    — lógica do painel principal
    ├── contas.js       — lógica de contas
    ├── categorias.js   — lógica de categorias
    └── operacoes.js    — lógica de operações
```

---

## Telas do sistema

### Login
- Autenticação com email e senha
- Token JWT salvo no LocalStorage
- Redirecionamento automático após login

### Cadastro
- Registro de novo usuário
- Validação de campos obrigatórios
- Validação de confirmação de senha
- Verificação de email já cadastrado

### Dashboard
- Saldo total de todas as contas
- Total de entradas e saídas
- Tabela com as últimas operações e conta vinculada

### Contas
- Listagem de contas com saldo
- Criação de nova conta com saldo inicial
- Visualização de operações por conta
- Adição de operação diretamente pelo card da conta
- Exclusão de conta (bloqueada se houver operações vinculadas)

### Categorias
- Listagem de categorias com tipo (Entrada/Saída)
- Criação de nova categoria
- Exclusão de categoria (bloqueada se houver operações vinculadas)

### Operações
- Listagem de todas as operações com conta e data
- Criação de nova operação com seleção de conta e categoria
- Exclusão de operação com reversão automática do saldo da conta

---

## Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (para rodar o servidor local)
- Backend do Cash Manager rodando

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/GITGUSH/cash-manager-web.git
cd cash-manager-web
```

**2. Configure a URL do backend**

Crie o arquivo `js/config.js`:
```javascript
const API_URL = "http://localhost:5284";
```

**3. Inicie um servidor local**
```bash
npx http-server -p 5500 -o
```

Ou use a extensão **Live Server** do VS Code.

**4. Acesse no navegador**
```
http://localhost:5500
```

---

## Autenticação

Todas as telas (exceto login e cadastro) verificam se o token JWT está presente no LocalStorage. Caso não esteja, o usuário é redirecionado automaticamente para a tela de login.

```javascript
const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";
```

O token é enviado em todas as requisições protegidas via header:

```javascript
Authorization: Bearer eyJhbGci...
```

---

## Como iniciar o sistema completo

Crie um arquivo `iniciar.bat` na pasta raiz dos projetos:

```bat
@echo off
echo Iniciando Cash Manager...

start "Backend" cmd /k "cd /d C:\Users\gusta\Projetos\Sistema_Gastos\cash_manager && dotnet run"

timeout /t 3 /nobreak

start "Frontend" cmd /k "cd /d C:\Users\gusta\Projetos\Sistema_Gastos\cash_manager_web && npx http-server -p 5500 -o"

echo Sistema iniciado!
```

Clica duas vezes no arquivo e o sistema inicia automaticamente.

---

## Autor

Desenvolvido por **Gustavo Fiocco**

[![GitHub](https://img.shields.io/badge/GitHub-GITGUSH-181717?style=flat&logo=github)](https://github.com/GITGUSH)