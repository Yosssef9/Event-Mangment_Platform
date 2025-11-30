import { useState } from "react";
import { HiMail, HiLockClosed, HiUser } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [roleValue, setRoleValue] = useState("attendee");
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  async function submitForm(e) {
    e.preventDefault();

    if (!nameValue.trim()) {
      setErrorMsg("Name is required");
      return;
    }

    if (passwordValue.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    setErrorMsg("");

    try {
      const res = await register(
        nameValue,
        emailValue,
        passwordValue,
        roleValue
      );
      console.log("res", res);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }

      // ✅ بعد النجاح
      navigate("/login");
    } catch (err) {
      console.error("❌ Register error:", err);
      setErrorMsg("Unexpected error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-purple-600 to-blue-500 flex justify-center items-center px-4">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="font-extrabold text-center text-4xl mb-8 text-purple-700">
          Register
        </h1>

        <form className="flex flex-col space-y-4" onSubmit={submitForm}>
          {/* 🔘 Role Toggle Switch with colored circle & labels */}
          <div className="flex items-center justify-center mb-4 gap-2">
            <span
              className={`px-3 py-1 rounded-full text-white font-medium transition-all ${
                roleValue === "attendee"
                  ? "bg-pink-600"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              Attendee
            </span>

            <div
              className={`relative w-16 h-8 ${
                roleValue === "attendee" ? "bg-pink-300/80" : "bg-purple-300/80"
              }  rounded-full cursor-pointer transition-all`}
              onClick={() =>
                setRoleValue(
                  roleValue === "attendee" ? "organizer" : "attendee"
                )
              }
            >
              <div
                className={`absolute top-1 left-1.5 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  roleValue === "organizer"
                    ? "translate-x-7 bg-purple-600"
                    : "bg-pink-600"
                }`}
              />
            </div>

            <span
              className={`px-3 py-1 rounded-full text-white font-medium transition-all ${
                roleValue === "organizer"
                  ? "bg-purple-600"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              Organizer
            </span>
          </div>
          {/* Name input */}
          <div className="relative">
            <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300 ease-in-out"
              type="text"
              placeholder="Full Name"
              required
            />
          </div>
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
                className="text-red-500 text-sm min-h-4 text-center"
              >
                {errorMsg}
              </motion.div>
            </AnimatePresence>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r cursor-pointer from-pink-600 to-purple-600 text-white font-semibold py-3 rounded-md hover:opacity-90 transition duration-300"
          >
            REGISTER
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pink-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
