import { useState } from "react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import AuthStage from "../components/AuthStage";
import PasswordInput from "../components/PasswordInput";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <AuthStage>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="text-sm text-base-content/60 mt-1">
        Sign in to continue your conversations on TalkSpace.
      </p>

      {error && (
        <div role="alert" className="mt-5 rounded-xl bg-error/10 text-error text-sm px-4 py-3">
          {error.response?.data?.message || "Can't reach the server. Please try again."}
        </div>
      )}

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="hello@example.com"
            className="input input-bordered w-full"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            Password
          </label>
          <PasswordInput
            id="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2" disabled={isPending}>
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="text-sm text-center text-base-content/70 mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
          Create one
        </Link>
      </p>
    </AuthStage>
  );
};

export default LoginPage;
