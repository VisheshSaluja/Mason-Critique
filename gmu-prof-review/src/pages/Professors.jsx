import { useState } from 'react';
import data from '../assets/gmu_cs_faculty_final.json';
import { Link } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = data.filter((prof) =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        GMU CS Professors
      </h1>

      {/* 🔍 Search box */}
      <div className="mb-8 flex justify-center">
      <div className="relative w-full max-w-md">
      <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by professor name..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFCC33] italic placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
</div>
 {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No professors found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((prof) => (
            <Link key={prof.id} to={`/professor/${prof.id}`}>
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-[#FFCC33] hover:scale-[1.02] transition-all duration-300 ease-in-out">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{prof.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{prof.title}</p>
                <p className="text-sm text-gray-500 truncate">📧 {prof.email}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
