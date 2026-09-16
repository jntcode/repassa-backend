<div align="center">

<img src="https://img.shields.io/badge/RePassa-Doa%C3%A7%C3%A3o-00C853?style=for-the-badge&logo=android&logoColor=white" />

# 📱 RePassa

### Doar nunca foi tao facil

Conectando quem quer **doar** com quem **precisa**.

Roupas, moveis, eletronicos, livros... Itens que voce nao usa mais podem transformar a vida de outra pessoa.

<br/>

<a href="https://github.com/jntcode/repassa-backend">
<img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
</a>
<a href="https://github.com/jntcode/repassa-backend">
<img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
</a>
<a href="https://github.com/jntcode/repassa-backend">
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</a>
<a href="https://github.com/jntcode/repassa-backend">
<img src="https://img.shields.io/badge/JWT-Seguran%C3%A7a-E91E63?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</a>

</div>

---

<br/>

## Como funciona

<table>
<tr>
<td width="50%" valign="top">

### 📲 Para quem quer doar

1. **Cadastre** seus itens com fotos e descricao
2. **Escolha** a categoria e condicao
3. **Aguarde** pedidos de doacao
4. **Aceite** e combine a entrega

</td>
<td width="50%" valign="top">

### 🙏 Para quem precisa

1. **Navegue** pelos itens disponiveis
2. **Filtre** por cidade, categoria ou bairro
3. **Solicite** o item que precisa
4. **Receba** e avalie a doacao

</td>
</tr>
</table>

---

<br/>

## App Preview

<div align="center">

<table>
<tr>
<td>

```
┌─────────────────────────┐
│  ☰  RePassa      🔔 👤  │
├─────────────────────────┤
│                         │
│  Ola, Maria! 👋         │
│  Que tal doar hoje?     │
│                         │
│ ┌─────────────────────┐ │
│ │ 🔍 Buscar item...   │ │
│ └─────────────────────┘ │
│                         │
│  Categorias             │
│  ┌───┐┌───┐┌───┐┌───┐  │
│  │👕 ││📱 ││📚 ││🪑 │  │
│  │Rou-││Elec││Liv-││Mó- │  │
│  │pas ││trô ││ros ││vel │  │
│  └───┘└───┘└───┘└───┘  │
│                         │
│  Itens Disponiveis      │
│ ┌─────────────────────┐ │
│ │ 👕 Camiseta Nike    │ │
│ │ Bom estado | SP     │ │
│ │ 📅 16/09            │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 📚 Livro Didatico   │ │
│ │ Novo | RJ           │ │
│ │ 📅 15/09            │ │
│ └─────────────────────┘ │
│                         │
│  🏠  📋  ➕  📩  👤     │
│ Home Itens Novo Msg Perfil│
└─────────────────────────┘
```

</td>
<td>

```
┌─────────────────────────┐
│  ←  Meus Itens          │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ 👕 Camiseta Nike    │ │
│ │ Bom estado | SP     │ │
│ │ ✅ Disponivel       │ │
│ │    [Editar] [❌]    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 📚 Livro Algebra    │ │
│ │ Usado | SP          │ │
│ │ 🔄 2 pedidos        │ │
│ │    [Ver pedidos]    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🪑 Cadeira Escrit.  │ │
│ │ Bom estado | SP     │ │
│ │ ✅ Disponivel       │ │
│ │    [Editar] [❌]    │ │
│ └─────────────────────┘ │
│                         │
│  ┌─────────────────┐    │
│  │   + Novo Item   │    │
│  └─────────────────┘    │
│                         │
│  🏠  📋  ➕  📩  👤     │
└─────────────────────────┘
```

</td>
</tr>
</table>

</div>

---

<br/>

## Funcionalidades

<table>
<tr>
<td width="33%" align="center">

### 🔐 Auth
Cadastro e login com JWT

</td>
<td width="33%" align="center">

### 📂 Categorias
Organize por tipo de item

</td>
<td width="34%" align="center">

### 📦 Itens
Cadastre e gerencie doacoes

</td>
</tr>
<tr>
<td align="center">

### 🤝 Pedidos
Solicite ou aceite doacoes

</td>
<td align="center">

### 🏙️ Busca
Filtre por cidade e bairro

</td>
<td align="center">

### ✅ Status
Acompanhe cada doacao

</td>
</tr>
</table>

---

<br/>

## API Endpoints

<details>
<summary><b>🔐 Autenticacao</b></summary>

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `POST` | `/api/auth/register` | Cadastro de usuario |
| `POST` | `/api/auth/login` | Login e receber token JWT |

</details>

<details>
<summary><b>📂 Categorias</b></summary>

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/api/categories` | Listar categorias |
| `GET` | `/api/categories/{id}` | Buscar categoria |
| `POST` | `/api/categories` | Criar categoria |
| `PUT` | `/api/categories/{id}` | Atualizar categoria |
| `DELETE` | `/api/categories/{id}` | Deletar categoria |

</details>

<details>
<summary><b>📦 Itens</b></summary>

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/api/items` | Listar meus itens |
| `GET` | `/api/items/all` | Todos os disponiveis |
| `GET` | `/api/items/{id}` | Buscar item |
| `GET` | `/api/items/category/{id}` | Filtrar por categoria |
| `GET` | `/api/items/city/{city}` | Filtrar por cidade |
| `POST` | `/api/items` | Criar item |
| `PUT` | `/api/items/{id}` | Atualizar item |
| `PUT` | `/api/items/{id}/unavailable` | Marcar indisponivel |
| `DELETE` | `/api/items/{id}` | Deletar item |

</details>

<details>
<summary><b>🤝 Pedidos de Doacao</b></summary>

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/api/donation-requests` | Pedidos recebidos |
| `GET` | `/api/donation-requests/sent` | Pedidos enviados |
| `GET` | `/api/donation-requests/{id}` | Buscar pedido |
| `POST` | `/api/donation-requests` | Criar pedido |
| `PUT` | `/api/donation-requests/{id}/accept` | Aceitar pedido |
| `PUT` | `/api/donation-requests/{id}/reject` | Rejeitar pedido |
| `PUT` | `/api/donation-requests/{id}/complete` | Concluir doacao |
| `DELETE` | `/api/donation-requests/{id}` | Deletar pedido |

</details>

---

<br/>

## Stack Tecnica

<table>
<tr>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" width="50" /><br/>
<b>Java 21</b>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="50" /><br/>
<b>Spring Boot 3.4</b>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="50" /><br/>
<b>PostgreSQL</b>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="50" /><br/>
<b>Docker</b>
</td>
</tr>
</table>

---

<br/>

## Rodar Localmente

```bash
# Clone o repositorio
git clone https://github.com/jntcode/repassa-backend.git
cd repassa-backend

# Execute a aplicacao
mvn spring-boot:run
```

A API estara disponivel em `http://localhost:8080`

H2 Console: `http://localhost:8080/h2-console`

<br/>

### Usuario de teste

| Email | Senha |
|-------|-------|
| `admin@repassa.com` | `secret123` |

---

<br/>

## Deploy

<div align="center">

| Passo | Comando |
|-------|---------|
| 1. Build Docker | `docker build -t repassa-backend .` |
| 2. Rodar | `docker run -p 8080:8080 repassa-backend` |

**Ou** conecte o repositorio no **Render** — o deploy e automatico a cada push.

</div>

---

<br/>

## Estrutura do Projeto

```
src/main/java/com/repassa/backend/
├── RepassaApplication.java
├── auth/               # 🔐 Autenticacao + JWT
│   ├── User.java
│   ├── AuthService.java
│   ├── JwtService.java
│   └── AuthController.java
├── category/           # 📂 Categorias
│   ├── Category.java
│   ├── CategoryService.java
│   └── CategoryController.java
├── item/               # 📦 Itens para doacao
│   ├── Item.java
│   ├── ItemService.java
│   └── ItemController.java
├── donationrequest/    # 🤝 Pedidos de doacao
│   ├── DonationRequest.java
│   ├── DonationRequestService.java
│   └── DonationRequestController.java
└── security/           # 🔒 Seguranca JWT
    ├── SecurityConfig.java
    └── JwtAuthenticationFilter.java
```

---

<br/>

<div align="center">

### Feito com ❤️ por

**Jhonata Rusaffa**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jntcode)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jhonata-silva-181675373/)

<br/>

**RePassa** — Porque toda coisa boa merece ser reaproveitada. ♻️

</div>
