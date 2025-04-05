import { useParams } from 'react-router-dom';
import professors from '../assets/gmu_cs_faculty_final.json';
import { useState } from 'react';

export default function ProfessorDetail() {
  const { id } = useParams();
  const professor = professors.find(p => p.id === parseInt(id));
  const [reviews, setReviews] = useState([]);

  const [form, setForm] = useState({
    course: '',
    grade: '',
    toughGrader: 'No',
    reviewText: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = { ...form };
    setReviews([...reviews, newReview]);
    setForm({ course: '', grade: '', toughGrader: 'No', reviewText: '' });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">{professor.name}</h1>
      <p className="text-gray-600 mb-2">{professor.title}</p>
      <p className="text-sm text-gray-700 mb-1">📧 {professor.email}</p>
      <p className="text-sm text-gray-700 mb-1">📍 {professor.office}</p>
      <p className="text-sm text-gray-700 mb-4">☎️ {professor.phone}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Anonymous Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 mb-4">No reviews yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-4 border rounded-xl bg-gray-50">
              <p className="text-sm text-gray-700"><strong>Course Taken:</strong> {r.course}</p>
              <p className="text-sm text-gray-700"><strong>Grade:</strong> {r.grade}</p>
              <p className="text-sm text-gray-700"><strong>Tough Grader:</strong> {r.toughGrader}</p>
              <p className="mt-2 text-gray-800">{r.reviewText}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Course Taken</label>
          <input
            className="w-full p-2 border rounded"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Grade Achieved</label>
          <input
            className="w-full p-2 border rounded"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Tough Grader?</label>
          <select
            className="w-full p-2 border rounded"
            value={form.toughGrader}
            onChange={(e) => setForm({ ...form, toughGrader: e.target.value })}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Your Review</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            value={form.reviewText}
            onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
