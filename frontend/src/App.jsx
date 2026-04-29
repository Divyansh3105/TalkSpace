import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { AuthProvider, GuestRoute, ProtectedRoute } from "./components/ProtectedRoute.jsx";

// Eagerly loaded pages (part of the initial bundle)
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import OnBoardingPage from "./pages/OnboardingPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Lazily loaded pages (loaded on demand — these pull in heavy SDKs)
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const CallPage = lazy(() => import("./pages/CallPage.jsx"));

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = Boolean(authUser?.isOnboarded);

  if (isLoading) return <PageLoader />;

  return (
    <ErrorBoundary>
      <div className="h-screen bg-base-100" data-theme={theme}>
        <AuthProvider isAuthenticated={isAuthenticated} isOnboarded={isOnboarded}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Public (guest-only) routes ── */}
              <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/signup" element={<GuestRoute><SignUpPage /></GuestRoute>} />

              {/* ── Onboarding ── */}
              <Route
                path="/onboarding"
                element={
                  isAuthenticated ? (
                    !isOnboarded ? <OnBoardingPage /> : <Navigate to="/" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* ── Protected routes (auth + onboarded, with sidebar) ── */}
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/chat/:id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

              {/* ── Call page — protected but no sidebar ── */}
              <Route path="/call/:id" element={<ProtectedRoute showSidebar={false}><CallPage /></ProtectedRoute>} />

              {/* ── 404 catch-all ── */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>

        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

export default App;
