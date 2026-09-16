# RePassa Backend

API REST para plataforma de doacao de roupas e objetos. Muitas pessoas possuem roupas e outros objetos que deixam de utilizar, e a falta de alternativas acessiveis para reutilizacao, doacao ou troca pode contribuir para o descarte de itens que ainda possuem condicoes de uso. O **RePassa** conecta quem quer doar com quem precisa.

## Stack

- Java 21
- Spring Boot 3.4
- Spring Data JPA + Hibernate
- Spring Security + JWT
- H2 (dev) / PostgreSQL (prod)
- Docker + Render

## Endpoints

### Auth
| Metodo | Rota              | Descricao           |
|--------|-------------------|---------------------|
| POST   | `/api/auth/register` | Cadastro de usuario |
| POST   | `/api/auth/login`    | Login               |

### Categories
| Metodo | Rota                  | Descricao               |
|--------|-----------------------|-------------------------|
| GET    | `/api/categories`     | Listar categorias       |
| GET    | `/api/categories/{id}`| Buscar categoria        |
| POST   | `/api/categories`     | Criar categoria         |
| PUT    | `/api/categories/{id}`| Atualizar categoria     |
| DELETE | `/api/categories/{id}`| Deletar categoria       |

### Items
| Metodo | Rota                          | Descricao                  |
|--------|-------------------------------|----------------------------|
| GET    | `/api/items`                  | Listar meus itens          |
| GET    | `/api/items/all`              | Listar todos disponiveis   |
| GET    | `/api/items/{id}`             | Buscar item                |
| GET    | `/api/items/category/{id}`    | Filtrar por categoria      |
| GET    | `/api/items/city/{city}`      | Filtrar por cidade         |
| POST   | `/api/items`                  | Criar item                 |
| PUT    | `/api/items/{id}`             | Atualizar item             |
| PUT    | `/api/items/{id}/unavailable` | Marcar como indisponivel   |
| DELETE | `/api/items/{id}`             | Deletar item               |

### Donation Requests
| Metodo | Rota                            | Descricao                  |
|--------|---------------------------------|----------------------------|
| GET    | `/api/donation-requests`        | Pedidos recebidos          |
| GET    | `/api/donation-requests/sent`   | Pedidos enviados           |
| GET    | `/api/donation-requests/{id}`   | Buscar pedido              |
| POST   | `/api/donation-requests`        | Criar pedido de doacao     |
| PUT    | `/api/donation-requests/{id}/accept`  | Aceitar pedido        |
| PUT    | `/api/donation-requests/{id}/reject`  | Rejeitar pedido        |
| PUT    | `/api/donation-requests/{id}/complete`| Concluir pedido        |
| DELETE | `/api/donation-requests/{id}`   | Deletar pedido             |

## Rodar localmente

```bash
mvn spring-boot:run
```

A API ficara disponivel em `http://localhost:8080`.

H2 Console: `http://localhost:8080/h2-console`

## Deploy no Render

O projeto ja vem configurado com `render.yaml` e `Dockerfile`. Basta conectar o repositorio no Render.

## Usuario padrao

- Email: `admin@repassa.com`
- Senha: `secret123`
