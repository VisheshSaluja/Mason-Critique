import { useState } from 'react';
import data from '../assets/gmu_cs_courses.json';
import { Link } from 'react-router-dom';

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = data.filter(
    (course) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 mt-4 text-center text-gray-800">
        GMU CS Courses
      </h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by course code or title..."
          className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No courses found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((course, i) => (
            <Link key={i} to={`/course/${encodeURIComponent(course.code)}`}>
              <div className="bg-white p-5 rounded-2xl shadow hover:shadow-xl border hover:border-green-500 transition-all">
                <h2 className="text-lg font-semibold text-gray-800">{course.code}</h2>
                <p className="text-sm text-gray-600 mt-1">{course.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
