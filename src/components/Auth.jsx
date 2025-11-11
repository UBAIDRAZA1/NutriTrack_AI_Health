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

      // Save token and userId to localStorage (to keep compatibility with existing logic)
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.userId);

      console.log("Auth Response:", result);

      // Stop spinner immediately on success before navigation/state changes
      setIsLoading(false);

      if (isLogin) {
        navigate("/home");
      } else {
        // Switch to Login view on successful registration
        setIsLogin(true);
      }

      // Reset form fields
      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setAge("");
      setWeight("");
      setHeight("");
      setError("");
    } catch (err) {
      const mapAuthError = (e) => {
        switch (e?.code) {
          case "auth/configuration-not-found":
            return "Email/Password sign-in is not enabled for this Firebase project. Enable it in Firebase Console → Authentication → Sign-in method.";
          case "auth/operation-not-allowed":
            return "The selected auth provider is disabled in Firebase. Enable it in Authentication settings.";
          case "auth/invalid-email":
            return "Please enter a valid email address.";
          case "auth/weak-password":
            return "Password must be at least 6 characters.";
          case "auth/email-already-in-use":
            return "This email is already registered. Try logging in instead.";
          case "auth/invalid-credential":
            return "Invalid credentials. Check your email and password and try again.";
          case "auth/too-many-requests":
            return "Too many attempts. Please wait a moment and try again.";
          case "auth/network-request-failed":
            return "Network error. Check your internet connection and try again.";
          default:
            return e?.message || "Authentication error";
        }
      };

      console.error("Auth Error:", err?.code, err?.message);
      // If the email is already registered during signup, switch to login form
      if (!isLogin && err?.code === "auth/email-already-in-use") {
        setIsLogin(true);
      }
      setError(mapAuthError(err));
    } finally {
      // Always stop the spinner even if an error occurs or a network request hangs
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-black via-gray-900 to-black">
      <div className="relative p-[2px] rounded-2xl w-96 overflow-hidden">
        <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,#ff00ff,#00ffff,#ff00ff)]"></div>
        <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl p-8 z-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wider">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            {!isLogin && (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Full Name"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Phone Number"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Age"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Weight (kg)"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Height (cm)"
                    required
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Email"
                autoComplete="new-email"
                required
              />
            </div>
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                placeholder="Password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 text-white p-3 rounded-lg font-bold hover:scale-105 transform transition-all duration-300 shadow-lg"
            >
              {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="text-center mt-4 text-gray-300">
            {isLogin ? "Need an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-pink-400 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Auth;