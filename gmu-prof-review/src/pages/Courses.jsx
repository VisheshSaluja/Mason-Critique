import { useState } from 'react';
import data from '../assets/gmu_cs_courses.json';
import { Link } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState({});

  // Group dynamically by 100-level blocks (e.g., 100–200, 200–300...)
  const grouped = {};

  const filtered = data.filter(
    (course) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filtered.forEach((course) => {
    const match = course.code.match(/\d+/);
    if (!match) return;

    const number = parseInt(match[0]);
    const start = Math.floor(number / 100) * 100;
    const end = start + 100;
    const label = `${start}–${end}`;

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(course);
  });

  const toggle = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        GMU CS Courses
      </h1>

      {/* 🔍 Search box */}
      <div className="mb-8 flex justify-center">
      <div className="relative w-full max-w-md">
      <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by course code or title..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFCC33] italic placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
</div>
      {Object.entries(grouped)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0])) // sort numerically
        .map(([level, courses]) => (
          <div key={level} className="mb-8">
            <button
              onClick={() => toggle(level)}
              className="w-full text-left text-xl font-semibold p-3 rounded bg-green-50 hover:bg-green-100 transition mb-3"

            >
              {expanded[level] !== false ? "▼" : "▶"} {level} Level ({courses.length} courses)
            </button>

            {expanded[level] !== false && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 px-1">
                {courses.map((course, i) => (
                  <Link key={i} to={`/course/${encodeURIComponent(course.code)}`}>
                    <div className="bg-white p-4 border rounded-xl shadow hover:border-green-500 hover:shadow-md transition">
                      <h3 className="text-lg font-semibold text-gray-800">{course.code}</h3>
                      <p className="text-sm text-gray-600 mt-1">{course.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

