"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect based on role
      router.refresh(); // Refresh layout to update session and sidebar
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/volunteer/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Church Logo/Header */}
        <div className="text-center mb-4 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
            Calvary Charismatic Centre
          </h1>
          <p className="text-blue-200">Evaluation Form Data Entry System</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
          <h2 className="text-xl font-semibold text-white text-center mb-4 md:mb-6">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-blue-100 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Enter your username"
                required
                aria-label="Username"
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blue-100 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
                aria-label="Password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 md:py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Sign in"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Role Information */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10">
            <p className="text-blue-200 text-sm text-center">
              <span className="font-medium text-white">Admin:</span> View
              reports & export data
            </p>
            <p className="text-blue-200 text-sm text-center mt-1">
              <span className="font-medium text-white">Volunteer:</span> Enter
              form responses
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-300 text-sm mt-4 md:mt-6">
          {new Date().getFullYear()} Calvary Charismatic Centre
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
