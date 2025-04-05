
import { useParams } from 'react-router-dom';
import professors from '../assets/gmu_cs_faculty_final.json';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { FaStar } from 'react-icons/fa';

export default function ProfessorDetail({ user }) {
  const { id } = useParams();
  const professor = professors.find(p => p.id === parseInt(id));
  const [reviews, setReviews] = useState([]);
  const [hover, setHover] = useState(null);
  const [form, setForm] = useState({
    course: '',
    grade: '',
    toughGrader: 'No',
    reviewText: '',
    stars: 5
  });

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(
        collection(db, "reviews"),
        where("target_type", "==", "professor"),
        where("target_id", "==", professor.id.toString())
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => doc.data());
      setReviews(results);
    };
    fetchReviews();
  }, [professor.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      target_type: "professor",
      target_id: professor.id.toString(),
      course: form.course,
      grade: form.grade,
      tough_grader: form.toughGrader,
      review_text: form.reviewText,
      reviewer_email: user,
      stars: Number(form.stars),
      created_at: Timestamp.now()
    };
    await addDoc(collection(db, "reviews"), payload);
    setReviews([...reviews, payload]);
    setForm({ course: '', grade: '', toughGrader: 'No', reviewText: '', stars: 5 });
  };

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.stars || 0), 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">{professor.name}</h1>
      <p className="text-gray-600 mb-2">{professor.title}</p>
      <p className="text-sm text-gray-700 mb-1">📧 {professor.email}</p>
      <p className="text-sm text-gray-700 mb-1">📍 {professor.office}</p>
      <p className="text-sm text-gray-700 mb-4">☎️ {professor.phone}</p>

      {averageRating && (
        <div className="text-yellow-500 text-xl font-semibold mb-4 flex items-center gap-2">
          Average Rating: {averageRating} <FaStar />
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Anonymous Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500 mb-4">No reviews yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-4 border rounded-xl bg-gray-50">
              <p className="text-sm text-gray-700"><strong>Course:</strong> {r.course}</p>
              <p className="text-sm text-gray-700"><strong>Grade:</strong> {r.grade}</p>
              <p className="text-sm text-gray-700"><strong>Tough Grader:</strong> {r.tough_grader}</p>
              <p className="text-sm text-yellow-500 flex items-center gap-1">
                <strong>Rating:</strong> {[...Array(r.stars)].map((_, i) => <FaStar key={i} />)}
              </p>
              <p className="mt-2 text-gray-800">{r.review_text}</p>
            </div>
          ))}
        </div>
      )}

      {!user ? (
        <p className="text-red-600">Please <a href="/login" className="underline">log in</a> to post a review.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded-xl p-6">
          <div>
            <label className="block font-medium mb-1">Course Taken</label>
            <input
              className="w-full p-2 border rounded"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Grade Achieved</label>
            <input
              className="w-full p-2 border rounded"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Tough Grader?</label>
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
            <label className="block font-medium mb-1">Star Rating</label>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => setForm({ ...form, stars: ratingValue })}
                    />
                    <FaStar
                      className="cursor-pointer text-2xl"
                      color={ratingValue <= (hover || form.stars) ? "#facc15" : "#d1d5db"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Your Review</label>
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
      )}
    </div>
  );
}
