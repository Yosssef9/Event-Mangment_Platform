import { useState } from "react";
import { HiMail } from "react-icons/hi";
import { HiLockClosed } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
export default function Login() {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login, googleLogin } = useAuth();

  const navigate = useNavigate();
  async function submitForm(e) {
    e.preventDefault();

    if (passwordValue.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");

      return;
    }
    setErrorMsg("");
    console.log("📡 Sending request to:", api.defaults.baseURL + "/auth/login");

    try {
      const res = await login(emailValue, passwordValue);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }
      const loggedUser = res.user;
      switch (loggedUser.role.toLowerCase()) {
        case "attendee":
          navigate("/");
          break;
        case "organizer":
          navigate("/organizerDashboard");
          break;
        case "admin":
          navigate("/adminDashboard");
          break;
      }
      console.log("✅ Login success:", res);
    } catch (err) {
      if (err.response) {
        // السيرفر ردّ فعلاً لكن فيه error
        console.error("❌ Login error:", err.response.data);
        setErrorMsg(err.response.data.message || "Login failed");
      } else if (err.request) {
        // السيرفر ما ردش أصلًا
        console.error("❌ No response from server");
        setErrorMsg("Server not responding. Please try again later.");
      } else {
        // خطأ من الكود نفسه
        console.error("❌ Request error:", err.message);
        setErrorMsg("Unexpected error. Please try again.");
      }
    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // Optional: decode for frontend info
      const decoded = jwtDecode(token);
      console.log("🟢 Google user:", decoded);

      // Send token to backend for verification / registration
      const res = await googleLogin(token);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }
      navigate("/");
    } catch (error) {
      console.error("❌ Google login error:", error);
      setErrorMsg("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-purple-600 to-blue-500 flex justify-center items-center px-4">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="font-extrabold text-center text-4xl mb-8 text-purple-700">
          Login
        </h1>

        <form className="flex flex-col space-y-4">
          {/* Email input */}
          <div className="relative">
            <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300 ease-in-out"
              type="email"
              placeholder="Email"
              required
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300 ease-in-out"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {errorMsg && (
            <AnimatePresence>
              <motion.div
                key="error-msg"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-red-500 text-sm h-4 text-center"
              >
                {errorMsg}
              </motion.div>
            </AnimatePresence>
          )}
          <button
            onClick={(e) => submitForm(e)}
            type="submit"
            className="bg-gradient-to-r cursor-pointer from-pink-600 to-purple-600 text-white font-semibold py-3 rounded-md hover:opacity-90 transition duration-300"
          >
            LOGIN
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          <p className="mb-3">Or login with</p>
          <div className="flex justify-center gap-4">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setErrorMsg("Google login failed")}
              useOneTap={false} // مهم: لو true هيظهر زر Google الافتراضي
              render={({ onClick, disabled }) => (
                <motion.button
                  onClick={onClick}
                  disabled={disabled}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center bg-white border border-gray-300 shadow-md w-16 h-16 rounded-md cursor-pointer transition"
                >
                  <span className="text-2xl font-bold text-red-500">G</span>
                </motion.button>
              )}
            />
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Not a member?{" "}
          <Link
            to="/register"
            className="text-pink-600 font-medium hover:underline"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
