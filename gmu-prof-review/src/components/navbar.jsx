// import { auth } from "../firebase";
// import { signOut } from "firebase/auth";

// export default function Navbar({ user, setUser }) {
//   const handleLogout = () => {
//     signOut(auth).then(() => {
//       localStorage.removeItem("gmu_user");
//       setUser(null);
//     });
//   };

//   return (
//     <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
//       <div className="flex gap-4">
//         <a href="/" className="font-bold">GMU Reviews</a>
//         <a href="/professors">Professors</a>
//         <a href="/courses">Courses</a>
//       </div>
//       <div className="text-sm flex items-center gap-2">
//         {user ? (
//           <>
//             <span className="text-green-400">{user}</span>
//             <button
//               onClick={handleLogout}
//               className="text-red-300 hover:underline"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <a href="/login" className="text-blue-300 hover:underline">Log In</a>
//         )}
//       </div>
//     </nav>
//   );
// }

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
      <div className="text-sm">
        {user ? (
          <div className="flex gap-4 items-center">
            <span className="text-green-300">{user}</span>
            <button onClick={handleLogout} className="hover:text-red-400 transition">Logout</button>
          </div>
        ) : (
          <a href="/login" className="bg-white text-[#006633] px-4 py-1 rounded font-medium hover:bg-yellow-300 transition">Log In</a>
        )}
      </div>
    </motion.nav>
  );
}
