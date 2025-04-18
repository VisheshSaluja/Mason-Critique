import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import loginBg from "../assets/gmu-bg.jpg"; // Your background image

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const userEmail = result.user.email;
        localStorage.setItem("gmu_user", userEmail);
        onLogin(userEmail);
        navigate("/");
      })
      .catch((error) => {
        console.error("OAuth Login Failed:", error);
        alert("Login failed. Please try again.");
      });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Animated Login Card */}
      <motion.div
        className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl px-10 py-10 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-[#006633] mb-4">Welcome to GMU Reviews</h1>
        <p className="text-gray-700 mb-8">
          Sign in to leave anonymous reviews for professors and courses.
        </p>
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-[#006633] text-white font-semibold rounded-lg hover:bg-[#FFCC33] transition duration-200"
        >
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );
}
