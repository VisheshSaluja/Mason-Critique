import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4">
      <h1 className="text-5xl font-bold mb-4">Welcome to GMU Reviews</h1>
      <p className="text-xl mb-8 text-center max-w-xl">
        A student-driven platform to review professors and courses at George Mason University.
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => navigate('/professors')}
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          View Professors
        </button>
        <button
          onClick={() => navigate('/courses')}
          className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Browse Courses
        </button>
      </div>

      <p className="mt-10 text-sm text-white/70">
        You don’t need to log in to browse, but you must log in to post a review.
      </p>
    </div>
  );
}
