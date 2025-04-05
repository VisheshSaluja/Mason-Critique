// import { useNavigate } from 'react-router-dom';

// export default function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4">
//       <h1 className="text-5xl font-bold mb-4">Welcome to GMU Reviews</h1>
//       <p className="text-xl mb-8 text-center max-w-xl">
//         A student-driven platform to review professors and courses at George Mason University.
//       </p>

//       <div className="flex gap-6">
//         <button
//           onClick={() => navigate('/professors')}
//           className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
//         >
//           View Professors
//         </button>
//         <button
//           onClick={() => navigate('/courses')}
//           className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
//         >
//           Browse Courses
//         </button>
//       </div>

//       <p className="mt-10 text-sm text-white/70">
//         You don’t need to log in to browse, but you must log in to post a review.
//       </p>
//     </div>
//   );
// }
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import bg from '../assets/gmu-bg.jpg';
import Navbar from '../components/navbar';

export default function Home({ user, setUser }) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Dimmed overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Navbar */}
      <Navbar user={user} setUser={setUser} />

      {/* Hero */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center pt-40 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Discover Professors. <br></br>Share Your Voice.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-10 max-w-2xl text-white/90"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          A student-driven platform to review professors and courses at George Mason University.
        </motion.p>

        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => navigate('/professors')}
            className="bg-[#FFCC33] text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            View Professors
          </button>
          <button
            onClick={() => navigate('/courses')}
            className="bg-white text-[#006633] px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Browse Courses
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
