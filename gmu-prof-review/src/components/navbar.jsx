import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Navbar({ user, setUser }) {
  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("gmu_user");
      setUser(null);
    });
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <a href="/" className="font-bold">GMU Reviews</a>
        <a href="/professors">Professors</a>
        <a href="/courses">Courses</a>
      </div>
      <div className="text-sm flex items-center gap-2">
        {user ? (
          <>
            <span className="text-green-400">{user}</span>
            <button
              onClick={handleLogout}
              className="text-red-300 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <a href="/login" className="text-blue-300 hover:underline">Log In</a>
        )}
      </div>
    </nav>
  );
}

  