import { useState } from "react";
import { Link } from "react-router";
import useSignup from "../hooks/useSignup.js";
import AuthStage from "../components/AuthStage";
import PasswordInput from "../components/PasswordInput";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignup();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <AuthStage>
      <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
      <p className="text-sm text-base-content/60 mt-1">
        Chat, call, and find people near you.
      </p>

      {error && (
        <div role="alert" className="mt-5 rounded-xl bg-error/10 text-error text-sm px-4 py-3">
          {error.response?.data?.message || "Can't reach the server. Please try again."}
        </div>
      )}

      <form onSubmit={handleSignup} className="mt-6 space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Your name"
            className="input input-bordered w-full"
            value={signupData.fullName}
            onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
            autoComplete="name"
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
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
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            autoComplete="new-password"
            minLength={6}
          />
          <p className="text-xs text-base-content/60 mt-1.5">At least 6 characters.</p>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2" disabled={isPending}>
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-sm text-center text-base-content/70 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthStage>
  );
};

export default SignUpPage;
