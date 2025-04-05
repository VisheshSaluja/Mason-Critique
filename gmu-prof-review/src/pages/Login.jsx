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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Log In to Review</h2>
        <button
          onClick={handleLogin}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
