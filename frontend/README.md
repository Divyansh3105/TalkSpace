# TalkSpace — Frontend

The client-side application for **TalkSpace**, built with React 19 and Vite. It handles all user-facing features including authentication, real-time chat, video calls, friend management, and multi-theme support.

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI framework |
| [Vite](https://vitejs.dev/) | 7 | Build tool & dev server |
| [React Router](https://reactrouter.com/) | 7 | Client-side routing |
| [TailwindCSS](https://tailwindcss.com/) | 3 | Utility-first CSS |
| [DaisyUI](https://daisyui.com/) | 4 | Component themes |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5 | Global state management |
| [TanStack Query](https://tanstack.com/query) | 5 | Server state & caching |
| [Axios](https://axios-http.com/) | 1 | HTTP requests |
| [Stream Chat React](https://getstream.io/chat/sdk/react/) | 13 | Chat UI components & SDK |
| [Stream Video React SDK](https://getstream.io/video/sdk/react/) | 1 | Video calling |
| [Lucide React](https://lucide.dev/) | — | Icons |
| [React Hot Toast](https://react-hot-toast.com/) | 2 | Toast notifications |

---

## 📁 Folder Structure

```
frontend/
├── public/                    # Static assets (favicon, images)
├── src/
│   ├── components/            # Shared/reusable UI components
│   │   ├── Navbar.jsx         # Top navigation bar
│   │   ├── Sidebar.jsx        # Friends sidebar
│   │   ├── Layout.jsx         # Page layout wrapper
│   │   ├── FriendCard.jsx     # Friend display card
│   │   ├── ThemeSelector.jsx  # DaisyUI theme picker
│   │   ├── CallButton.jsx     # Initiate video call
│   │   ├── ChatLoader.jsx     # Chat loading skeleton
│   │   ├── PageLoader.jsx     # Full-page loading spinner
│   │   ├── NoFriendsFound.jsx # Empty state component
│   │   └── NoNotificationsFound.jsx
│   ├── pages/                 # Route-level page components
│   │   ├── HomePage.jsx       # Dashboard / friends overview
│   │   ├── ChatPage.jsx       # 1-on-1 chat with Stream Chat
│   │   ├── CallPage.jsx       # Video call with Stream Video
│   │   ├── NotificationsPage.jsx
│   │   ├── OnboardingPage.jsx # New user profile setup
│   │   ├── LoginPage.jsx
│   │   └── SignUpPage.jsx
│   ├── hooks/                 # Custom React hooks (e.g. useAuthUser)
│   ├── store/                 # Zustand stores (e.g. useThemeStore)
│   ├── lib/                   # Axios instance, Stream client setup
│   ├── constants/             # App-wide constant values
│   ├── App.jsx                # Root component & route definitions
│   ├── main.jsx               # React DOM entry point
│   └── index.css              # Global base styles
├── index.html                 # HTML shell with SEO meta tags
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # TailwindCSS + DaisyUI config
├── postcss.config.js          # PostCSS config
└── eslint.config.js           # ESLint rules
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Backend server running on `http://localhost:5001`
- A [Stream](https://getstream.io/) account with a valid API key

### Installation

```bash
# From the frontend directory
npm install
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

### Development

```bash
npm run dev
```

Starts the Vite dev server at **http://localhost:5173** with Hot Module Replacement (HMR).

### Build for Production

```bash
npm run build
```

Outputs the optimized static bundle to `frontend/dist/`, which is served by the backend Express server in production mode.

### Preview Production Build Locally

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 🗺️ Application Routes

| Path | Page | Auth Required |
|------|------|:---:|
| `/` | Home — friends list & recommendations | ✅ |
| `/signup` | Sign Up | ❌ |
| `/login` | Login | ❌ |
| `/onboarding` | Profile setup (new users) | ✅ |
| `/chat/:id` | Real-time chat with a friend | ✅ |
| `/call/:id` | Video call with a friend | ✅ |
| `/notifications` | Friend request notifications | ✅ |

All protected routes redirect to `/login` if unauthenticated, or `/onboarding` if the user has not completed profile setup.

---

## 🎨 Theming

TalkSpace supports multiple themes powered by **DaisyUI**. The active theme is persisted in a **Zustand** store (`useThemeStore`) and applied at the root `<div data-theme={theme}>` element, so the entire app updates instantly without a page reload.

Users can switch themes from the **ThemeSelector** component in the navbar.
