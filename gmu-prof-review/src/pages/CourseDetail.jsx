import { useParams } from 'react-router-dom';
import courses from '../assets/gmu_cs_courses.json';
import { useState } from 'react';

export default function CourseDetail() {
  const { code } = useParams();
  const course = courses.find((c) => c.code === decodeURIComponent(code));
  const [reviews, setReviews] = useState([]);

  const [form, setForm] = useState({
    professor: '',
    grade: '',
    toughGrader: 'No',
    reviewText: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = { ...form };
    setReviews([...reviews, newReview]);
    setForm({ professor: '', grade: '', toughGrader: 'No', reviewText: '' });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800">{course.code}</h1>
      <p className="text-gray-600 mb-4">{course.title}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Anonymous Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 mb-4">No reviews yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-4 border rounded-xl bg-gray-50">
              <p className="text-sm text-gray-700"><strong>Professor:</strong> {r.professor}</p>
              <p className="text-sm text-gray-700"><strong>Grade:</strong> {r.grade}</p>
              <p className="text-sm text-gray-700"><strong>Tough Grader:</strong> {r.toughGrader}</p>
              <p className="mt-2 text-gray-800">{r.reviewText}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Professor Taken Under</label>
          <input
            className="w-full p-2 border rounded"
            value={form.professor}
            onChange={(e) => setForm({ ...form, professor: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Grade Received</label>
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
