import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Welcome to GMU Reviews
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to leave anonymous reviews for professors and courses.
        </p>
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
