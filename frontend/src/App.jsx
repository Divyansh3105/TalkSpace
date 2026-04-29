import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

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
  const isOnboarded = authUser?.isOnboarded;
  if (isLoading) return <PageLoader />;

  return (
    <ErrorBoundary>
      <div className="h-screen bg-base-100" data-theme={theme}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar>
                    <HomePage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                !isAuthenticated ? (
                  <SignUpPage />
                ) : (
                  <Navigate to={isOnboarded ? "/" : "/onboarding"} />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <LoginPage />
                ) : (
                  <Navigate to={isOnboarded ? "/" : "/onboarding"} />
                )
              }
            />
            <Route
              path="/notifications"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar={true}>
                    <NotificationsPage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />
            <Route
              path="/friends"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar={true}>
                    <FriendsPage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />
            <Route
              path="/call/:id"
              element={
                isAuthenticated && isOnboarded ? (
                  <CallPage />
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />
            <Route
              path="/chat/:id"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar={true}>
                    <ChatPage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar={true}>
                    <ProfilePage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar={true}>
                    <SettingsPage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />
            <Route
              path="/onboarding"
              element={
                isAuthenticated ? (
                  !isOnboarded ? (
                    <OnBoardingPage />
                  ) : (
                    <Navigate to="/" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

export default App;
