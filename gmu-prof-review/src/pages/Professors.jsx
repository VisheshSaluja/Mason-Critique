import { useState } from 'react';
import data from '../assets/gmu_cs_faculty_final.json';
import { Link } from 'react-router-dom';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = data.filter((prof) =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 mt-4 text-center text-gray-800">
        GMU CS Professors
      </h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by professor name..."
          className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No professors found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((prof) => (
            <Link key={prof.id} to={`/professor/${prof.id}`}>
              <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-all border hover:border-blue-500">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{prof.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{prof.title}</p>
                <p className="text-sm text-gray-500">📧 {prof.email}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
