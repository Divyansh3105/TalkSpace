<div align="center">

<img src="taltspace.ico" alt="TalkSpace Logo" width="80" height="80" />

# TalkSpace

**Connect, Chat & Collaborate in Real-Time**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Stream](https://img.shields.io/badge/Stream-Chat%20%26%20Video-005FFF?style=flat-square&logo=stream)](https://getstream.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Live Demo](https://talkspace.app) · [Report Bug](https://github.com/Divyansh3105/TalkSpace/issues) · [Request Feature](https://github.com/Divyansh3105/TalkSpace/issues)

</div>

---

## 📖 About

**TalkSpace** is a full-stack real-time communication platform that enables users to connect with friends, send messages, make video calls, and manage their social connections — all from one place.

Built with a modern tech stack, TalkSpace integrates the [Stream](https://getstream.io/) platform for scalable, production-ready chat and video calling capabilities.

---

## ✨ Features

- 🔐 **Authentication** — Secure sign-up, login, and logout with JWT-based sessions
- 🧭 **Onboarding Flow** — Profile setup with native language and learning language preferences
- 👥 **Friend System** — Send, receive, and accept friend requests; view recommended users
- 💬 **Real-Time Messaging** — Powered by Stream Chat SDK with instant delivery
- 📹 **Video Calls** — One-on-one video calling via Stream Video React SDK
- 🔔 **Notifications** — Friend request notifications in real-time
- 🎨 **Theme Selector** — Multiple DaisyUI themes with persistent preference via Zustand
- 📱 **Responsive Design** — Fully responsive across desktop and mobile devices

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [TailwindCSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) | Styling & theming |
| [Zustand](https://zustand-demo.pmnd.rs/) | Global state management |
| [TanStack Query](https://tanstack.com/query) | Server state & data fetching |
| [Axios](https://axios-http.com/) | HTTP client |
| [Stream Chat React](https://getstream.io/chat/sdk/react/) | Chat UI & SDK |
| [Stream Video React SDK](https://getstream.io/video/sdk/react/) | Video call SDK |
| [Lucide React](https://lucide.dev/) | Icon library |
| [React Hot Toast](https://react-hot-toast.com/) | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | REST API server |
| [MongoDB](https://mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database & ODM |
| [Stream Chat (Server SDK)](https://getstream.io/chat/sdk/node/) | Chat token generation |
| [JSON Web Tokens](https://jwt.io/) | Authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [cookie-parser](https://github.com/expressjs/cookie-parser) | HTTP cookie handling |
| [CORS](https://github.com/expressjs/cors) | Cross-origin resource sharing |

---

## 📁 Project Structure

```
TalkSpace/
├── frontend/                  # React + Vite frontend
│   ├── public/                # Static assets
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── FriendCard.jsx
│       │   ├── ThemeSelector.jsx
│       │   └── ...
│       ├── pages/             # Application pages/routes
│       │   ├── HomePage.jsx
│       │   ├── ChatPage.jsx
│       │   ├── CallPage.jsx
│       │   ├── NotificationsPage.jsx
│       │   ├── OnboardingPage.jsx
│       │   ├── LoginPage.jsx
│       │   └── SignUpPage.jsx
│       ├── hooks/             # Custom React hooks
│       ├── store/             # Zustand state stores
│       ├── lib/               # Utility functions & config
│       └── constants/         # App-wide constants
│
└── backend/                   # Express REST API
    └── src/
        ├── controllers/       # Route handler logic
        ├── routes/            # API route definitions
        ├── middleware/        # Auth & other middleware
        ├── lib/               # DB connection & utilities
        └── server.js          # App entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://mongodb.com/) (local or Atlas cluster)
- A [Stream](https://getstream.io/) account (for Chat & Video APIs)

### 1. Clone the Repository

```bash
git clone https://github.com/Divyansh3105/TalkSpace.git
cd TalkSpace
```

### 2. Configure Environment Variables

**Backend** — create `backend/.env`:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

NODE_ENV=development
```

**Frontend** — create `frontend/.env`:

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

### 3. Install Dependencies & Run

**Run both servers in development mode:**

```bash
# Backend (from project root)
cd backend
npm install
npm run dev        # Starts on http://localhost:5001

# Frontend (open a second terminal)
cd frontend
npm install
npm run dev        # Starts on http://localhost:5173
```

---

## 🔌 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/signup` | Register a new user | ❌ |
| `POST` | `/login` | Authenticate user | ❌ |
| `POST` | `/logout` | Invalidate session | ❌ |
| `POST` | `/onboarding` | Complete user profile setup | ✅ |
| `GET` | `/me` | Get current authenticated user | ✅ |

### User Routes — `/api/users`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Get recommended users | ✅ |
| `GET` | `/friends` | Get user's friends list | ✅ |
| `POST` | `/friend-request/:id` | Send a friend request | ✅ |
| `PUT` | `/friend-request/:id/accept` | Accept a friend request | ✅ |
| `GET` | `/friend-request/` | Get incoming friend requests | ✅ |
| `GET` | `/outgoing-friend-request/` | Get outgoing friend requests | ✅ |

### Chat Routes — `/api/chat`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/token` | Generate Stream Chat user token | ✅ |

---

## 🏗️ Building for Production

From the project root:

```bash
npm run build   # Installs all deps & builds the frontend
npm run start   # Starts the backend server (serves frontend in production)
```

The Express server will serve the built React app from `frontend/dist/` in production mode.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch — `git checkout -b feature/your-feature-name`
3. **Commit** your changes — `git commit -m 'feat: add some feature'`
4. **Push** to the branch — `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please make sure your code follows the existing project style and passes linting (`npm run lint` in the `frontend` directory).

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 🙏 Acknowledgements

- [Stream](https://getstream.io/) for the powerful Chat & Video SDKs
- [DaisyUI](https://daisyui.com/) for the beautiful component themes
- [Lucide](https://lucide.dev/) for the clean icon set

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Divyansh3105">Divyansh</a>
</div>
