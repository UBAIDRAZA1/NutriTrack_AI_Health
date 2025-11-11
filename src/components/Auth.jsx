import React, { useState } from "react";
import { signupUser, loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = isLogin
        ? { email, password }
        : {
            name,
            phone,
            email,
            password,
            age: Number(age),
            weight: Number(weight),
            height: Number(height),
          };

      const result = isLogin ? await loginUser(payload) : await signupUser(payload);

      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.userId);

      setIsLoading(false);

      if (isLogin) {
        navigate("/home");
      } else {
        setIsLogin(true);
      }

      setName(""); setPhone(""); setEmail(""); setPassword("");
      setAge(""); setWeight(""); setHeight("");
      setError("");
    } catch (err) {
      const mapAuthError = (e) => {
        switch (e?.code) {
          case "auth/invalid-email": return "Invalid email address.";
          case "auth/weak-password": return "Password must be 6+ characters.";
          case "auth/email-already-in-use": return "Email already registered. Try logging in.";
          case "auth/invalid-credential": return "Wrong email or password.";
          case "auth/too-many-requests": return "Too many attempts. Try again later.";
          case "auth/network-request-failed": return "Check internet connection.";
          default: return e?.message || "Authentication failed.";
        }
      };

      if (!isLogin && err?.code === "auth/email-already-in-use") {
        setIsLogin(true);
      }
      setError(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-black via-gray-900 to-black p-4">
      {/* Animated Border Container (Lines Restored!) */}
      <div className="relative p-[3px] rounded-3xl w-full max-w-md mx-auto overflow-hidden">
        {/* Animated Gradient Border (Original Lines Effect) */}
        <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg_at_50%_50%,#ff00ff_0%,#00ffff_50%,#ff00ff_100%)] rounded-3xl"></div>

        {/* Inner Glass Card */}
        <div className="relative bg-black/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-800 z-10">
          
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              NutriTrack AI
            </h1>
            <p className="text-gray-400 text-sm mt-1">{isLogin ? "Welcome back!" : "Create account"}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* Sign Up Fields */}
            {!isLogin && (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm sm:text-base"
                  placeholder="Full Name"
                  required
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm sm:text-base"
                  placeholder="Phone Number"
                  required
                />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm sm:text-base"
                  placeholder="Age"
                  required
                />
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm sm:text-base"
                  placeholder="Weight (kg)"
                  required
                />
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm sm:text-base"
                  placeholder="Height (cm)"
                  required
                />
              </>
            )}

            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm sm:text-base"
              placeholder="Email"
              autoComplete="new-email"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all pr-12 text-sm sm:text-base"
                placeholder="Password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-xs sm:text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 text-white p-3 sm:p-4 rounded-xl font-bold text-sm sm:text-base hover:scale-105 transform transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                isLogin ? "Login" : "Sign Up"
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-5 text-gray-400 text-xs sm:text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 font-medium underline-offset-2 hover:underline transition-all"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>

          {/* Footer */}
          <p className="text-center mt-6 text-gray-500 text-xs">
            By continuing, you agree to our{" "}
            <span className="text-cyan-400 cursor-pointer hover:underline">Terms</span> &{" "}
            <span className="text-cyan-400 cursor-pointer hover:underline">Privacy</span>
          </p>
        </div>
      </div>

      {/* Original Animated Border CSS (Lines Restored!) */}
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Auth;