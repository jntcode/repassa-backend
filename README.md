<div align="center">

<img src="https://img.shields.io/badge/RePassa-Donate-FF6D00?style=for-the-badge&logo=android&logoColor=white" />

# RePassa

### Donating has never been easier

Connecting those who want to **donate** with those who **need**.

Clothes, furniture, electronics, books... Items you no longer use can transform someone else's life.

<br/>

<a href="https://jntcode.github.io/repassa-backend/">
<img src="https://img.shields.io/badge/Live_Demo-Try_It-FF6D00?style=for-the-badge&logo=vercel&logoColor=white" />
</a>
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
<img src="https://img.shields.io/badge/JWT-Security-E91E63?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</a>

</div>

---

<br/>

## How it works

<table>
<tr>
<td width="50%" valign="top">

### For donors

1. **Register** your items with description
2. **Choose** the category and condition
3. **Wait** for donation requests
4. **Accept** and arrange the delivery

</td>
<td width="50%" valign="top">

### For those in need

1. **Browse** available items
2. **Filter** by city, category or neighborhood
3. **Request** the item you need
4. **Receive** the donation

</td>
</tr>
</table>

---

<br/>

## App Preview

<div align="center">

<a href="https://jntcode.github.io/repassa-backend/">
<img src="https://img.shields.io/badge/Click_here_to_try_the_live_demo-FF6D00?style=for-the-badge&logo=vercel&logoColor=white&labelColor=FF6D00" />
</a>

</div>

---

<br/>

## Features

<table>
<tr>
<td width="33%" align="center">

### Authentication
Sign up and login with JWT

</td>
<td width="33%" align="center">

### Categories
Organize by item type

</td>
<td width="34%" align="center">

### Items
Register and manage donations

</td>
</tr>
<tr>
<td align="center">

### Requests
Request or accept donations

</td>
<td align="center">

### Search
Filter by city and neighborhood

</td>
<td align="center">

### Status
Track every donation

</td>
</tr>
</table>

---

<br/>

## API Endpoints

<details>
<summary><b>Authentication</b></summary>

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |

</details>

<details>
<summary><b>Categories</b></summary>

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/categories` | List categories |
| `GET` | `/api/categories/{id}` | Get category by ID |
| `POST` | `/api/categories` | Create category |
| `PUT` | `/api/categories/{id}` | Update category |
| `DELETE` | `/api/categories/{id}` | Delete category |

</details>

<details>
<summary><b>Items</b></summary>

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/items` | List my items |
| `GET` | `/api/items/all` | All available items |
| `GET` | `/api/items/{id}` | Get item by ID |
| `GET` | `/api/items/category/{id}` | Filter by category |
| `GET` | `/api/items/city/{city}` | Filter by city |
| `POST` | `/api/items` | Create item |
| `PUT` | `/api/items/{id}` | Update item |
| `PUT` | `/api/items/{id}/unavailable` | Mark as unavailable |
| `DELETE` | `/api/items/{id}` | Delete item |

</details>

<details>
<summary><b>Donation Requests</b></summary>

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/donation-requests` | Received requests |
| `GET` | `/api/donation-requests/sent` | Sent requests |
| `GET` | `/api/donation-requests/{id}` | Get request by ID |
| `POST` | `/api/donation-requests` | Create request |
| `PUT` | `/api/donation-requests/{id}/accept` | Accept request |
| `PUT` | `/api/donation-requests/{id}/reject` | Reject request |
| `PUT` | `/api/donation-requests/{id}/complete` | Complete donation |
| `DELETE` | `/api/donation-requests/{id}` | Delete request |

</details>

---

<br/>

## Tech Stack

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

## Run Locally

```bash
# Clone the repository
git clone https://github.com/jntcode/repassa-backend.git
cd repassa-backend

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

H2 Console: `http://localhost:8080/h2-console`

<br/>

### Test User

| Email | Password |
|-------|----------|
| `admin@repassa.com` | `secret123` |

---

<br/>

## Deploy

<div align="center">

| Step | Command |
|------|---------|
| 1. Build Docker | `docker build -t repassa-backend .` |
| 2. Run | `docker run -p 8080:8080 repassa-backend` |

**Or** connect the repository to **Render** - deploy is automatic on every push.

</div>

---

<br/>

## Project Structure

```
src/main/java/com/repassa/backend/
├── RepassaApplication.java
├── auth/                 Authentication + JWT
│   ├── User.java
│   ├── AuthService.java
│   ├── JwtService.java
│   └── AuthController.java
├── category/             Categories
│   ├── Category.java
│   ├── CategoryService.java
│   └── CategoryController.java
├── item/                 Donation items
│   ├── Item.java
│   ├── ItemService.java
│   └── ItemController.java
├── donationrequest/      Donation requests
│   ├── DonationRequest.java
│   ├── DonationRequestService.java
│   └── DonationRequestController.java
└── security/             JWT Security
    ├── SecurityConfig.java
    └── JwtAuthenticationFilter.java
```

---

<br/>

<div align="center">

### Built with by

**Jhonata Rusaffa**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jntcode)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jhonata-silva-181675373/)

<br/>

**RePassa** - Because every good thing deserves to be reused.

</div>
