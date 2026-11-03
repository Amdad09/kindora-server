# Kindora — Backend API

The backend API for **Kindora**, a social development events platform that helps people discover, create, and participate in community-driven events.

Built with **Node.js, Express.js, TypeScript, and MongoDB**.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Official Node.js Driver)
- **Validation:** Zod
- **Authentication:** Better Auth (JWT verification)
- **JWT Verification:** jose
- **Deployment:** Render

## ✨ Features

- Create and manage social development events.
- Retrieve upcoming events.
- Search events by title, description, and location.
- Filter events by category.
- Paginated event listings.
- Secure API endpoints using JWT authentication.
- Verify authentication tokens through Better Auth JWKS.
- Track event creators and ownership.
- Event registration and joined-event status.
- Validate incoming data using Zod.

## 📁 Project Structure

```text
src/
├── config/
│   ├── db.ts
│   └── env.ts
│
├── modules/
│   ├── events/
│   │   ├── events.controller.ts
│   │   ├── events.route.ts
│   │   ├── events.service.ts
│   │   └── events.validation.ts
│   │
│   └── ...
│
├── middlewares/
│   ├── verifyJWT.ts
│   └── validateRequest.ts
│
├── app.ts
└── server.ts

.env
.gitignore
package.json
tsconfig.json
```

*The structure above is a representative overview. Update it to match the actual repository.*

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_BACKEND_REPOSITORY_URL>
```

### 2. Navigate to the project

```bash
cd kindora-server
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000

DB_NAME=kindora
MONGO_URI=your_mongodb_connection_string

BETTER_AUTH_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

For production, replace the local frontend URL with your deployed frontend URL.

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `DB_NAME` | MongoDB database name |
| `MONGO_URI` | MongoDB connection string |
| `BETTER_AUTH_URL` | Frontend URL where Better Auth is configured |
| `CLIENT_URL` | Frontend origin allowed by CORS |

**Important:** Never commit your `.env` file or expose database credentials.

### 5. Run the development server

```bash
npm run dev
```

Use the scripts configured in `package.json` if their names differ.

## 🔐 Authentication

Kindora uses **Better Auth** on the frontend for user authentication.

The backend verifies JWT access tokens using:

- `jose` for JWT verification.
- Better Auth's JWKS endpoint for public signing keys.
- Issuer and audience validation.
- Protected API middleware.

The backend retrieves public keys from:

```text
${BETTER_AUTH_URL}/api/auth/jwks
```

Protected endpoints require a valid JWT in the request's authorization header:

```http
Authorization: Bearer <access_token>
```

## 🌐 API

**Base URL — Local**

```text
http://localhost:5000
```

**Base URL — Production**

```text
https://kindora-server.onrender.com
```

### Events

| Method | Endpoint | Description |
|---|---|---|
| GET | `/events` | Retrieve upcoming events |
| POST | `/events` | Create an event |
| GET | `/events/:id` | Retrieve event details |
| PATCH | `/events/:id` | Update an event |
| DELETE | `/events/:id` | Delete an event |

*Confirm the route list against the actual Express router before publishing.*

### Query Parameters

The upcoming events endpoint supports:

| Parameter | Description | Example |
|---|---|---|
| `page` | Page number | `1` |
| `limit` | Results per page | `10` |
| `search` | Search by title, description, or location | `cleanup` |
| `eventType` | Filter by event category | `Environment` |

Example:

```http
GET /events?page=1&limit=10&search=cleanup&eventType=Environment
```

## 🧪 Validation

Incoming request data is validated using **Zod** before reaching the service layer.

Validation helps ensure that:

- Required fields are provided.
- Data types and formats are correct.
- Event categories are valid.
- Invalid requests are rejected with meaningful errors.

## 🚀 Deployment

The backend is deployed on **Render**.

Production API:

https://kindora-server.onrender.com

Make sure all required environment variables are configured in the Render dashboard.

## 🔗 Related Project

**Frontend:** https://kindora-six.vercel.app

## 👨‍💻 Author

**Amdadul Haque**

Building Today, Scaling Tomorrow.

---

*Kindora — Bringing communities together through meaningful events.*