import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

export default function Navbar({ user, setUser }) {
  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("gmu_user");
      setUser(null);
    });
  };

  return (
    <motion.nav
  className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center bg-transparent z-50"
  initial={{ y: -50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8 }}
>

      <div className="flex items-center gap-8 text-lg font-semibold">
      <a href="/">
  <img src="/logo.webp" alt="GMU Logo" className="h-10" />
</a>

        <a href="/professors" className="hover:text-[#FFCC33] transition">Professors</a>
        <a href="/courses" className="hover:text-[#FFCC33] transition">Courses</a>
      </div>
      <div className="text-sm flex items-center gap-4">
  {user ? (
    <>
      <span className="text-green-300 whitespace-nowrap">{user}</span>
      <button
        onClick={handleLogout}
        className="bg-white text-[#006633] font-semibold px-4 py-1 rounded hover:bg-yellow-300 transition"
      >
        Logout
      </button>
    </>
  ) : (
    <a
      href="/login"
      className="bg-white text-[#006633] font-semibold px-4 py-1 rounded hover:bg-yellow-300 transition"
    >
      Log In
    </a>
  )}
</div>

    </motion.nav>
  );
}
