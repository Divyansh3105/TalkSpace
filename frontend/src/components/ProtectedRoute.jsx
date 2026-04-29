import { Navigate } from "react-router";
import Layout from "./Layout.jsx";

/**
 * ProtectedRoute — wraps pages that require a fully authenticated + onboarded user.
 *
 * Props:
 *   children     ReactNode   The page component to render
 *   showSidebar  boolean     Whether to wrap in <Layout showSidebar> (default: true)
 */
export const ProtectedRoute = ({ children, showSidebar = true }) => {
  // These values come from the closest ancestor that calls useAuthUser.
  // We read them from window.__authState__ which is set by App.jsx to avoid
  // prop-drilling through every route — instead we use a small context.
  // See AuthContext at the bottom of this file.
  const { isAuthenticated, isOnboarded } = useAuthContext();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  return showSidebar ? <Layout showSidebar>{children}</Layout> : children;
};

/**
 * GuestRoute — wraps pages that should only be shown to unauthenticated users
 * (login, signup). Redirects authenticated+onboarded users to home.
 */
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isOnboarded } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />;
  }

  return children;
};

// ---------------------------------------------------------------------------
// Tiny React context so ProtectedRoute / GuestRoute can read auth state
// without prop-drilling through every <Route element={...}>.
// ---------------------------------------------------------------------------
import { createContext, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ isAuthenticated, isOnboarded, children }) => (
  <AuthContext.Provider value={{ isAuthenticated, isOnboarded }}>
    {children}
  </AuthContext.Provider>
);

const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
};
