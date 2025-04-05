import { useState } from 'react';
import data from '../assets/gmu_cs_courses.json';
import { Link } from 'react-router-dom';

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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        GMU CS Courses
      </h1>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by course code or title..."
          className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {Object.entries(grouped)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0])) // sort numerically
        .map(([level, courses]) => (
          <div key={level} className="mb-8">
            <button
              onClick={() => toggle(level)}
              className="w-full text-left text-xl font-semibold p-3 rounded bg-gray-100 hover:bg-gray-200 transition mb-3"
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

