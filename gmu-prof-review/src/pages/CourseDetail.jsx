import { useParams } from 'react-router-dom';
import courses from '../assets/gmu_cs_courses.json';
import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const allGrades = ['A', 'B', 'C', 'D', 'F']; 

export default function CourseDetail({ user }) {
  const { code } = useParams();
  const course = courses.find((c) => c.code === decodeURIComponent(code));

  const [reviews, setReviews] = useState([]);
  const [gradeStats, setGradeStats] = useState({});
  const [averageRating, setAverageRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({
    professor: '',
    grade: '',
    toughGrader: '',
    reviewText: '',
    rating: 0,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(
        collection(db, "reviews"),
        where("target_type", "==", "course"),
        where("target_id", "==", course.code)
      );
      const snapshot = await getDocs(q);
      const results = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const repliesSnap = await getDocs(collection(db, `reviews/${docSnap.id}/replies`));
          return {
            id: docSnap.id,
            ...docSnap.data(),
            replies: repliesSnap.docs.map(r => r.data())
          };
        })
      );
      setReviews(results);

      const gradeCount = {};
      results.forEach(r => {
        const grade = r.grade?.toUpperCase();
        if (grade) {
          gradeCount[grade] = (gradeCount[grade] || 0) + 1;
        }
      });
      setGradeStats(gradeCount);

      const ratingSum = results.reduce((sum, r) => sum + (r.rating || 0), 0);
      const avg = results.length > 0 ? (ratingSum / results.length).toFixed(1) : null;
      setAverageRating(avg);
    };
    fetchReviews();
  }, [course.code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.professor || form.rating === 0) {
      alert("Please fill in all required fields and select a star rating.");
      return;
    }
    const payload = {
      target_type: "course",
      target_id: course.code,
      course: course.code,
      professor: form.professor,
      grade: form.grade,
      tough_grader: form.toughGrader,
      review_text: form.reviewText,
      rating: form.rating,
      reviewer_email: user,
      reviewer_display_name: "Anonymous",
      upvotes: 0,
      downvotes: 0,
      created_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "reviews"), payload);
    setReviews([...reviews, { ...payload, id: docRef.id, replies: [] }]);
    setForm({ professor: '', grade: '', toughGrader: 'No', reviewText: '', rating: 3 });
  };

  const handleVote = async (reviewId, type) => {
    const reviewRef = doc(db, "reviews", reviewId);
    const review = reviews.find(r => r.id === reviewId);
    const updatedReview = {
      ...review,
      [type]: (review[type] || 0) + 1
    };

    await updateDoc(reviewRef, {
      [type]: updatedReview[type]
    });

    setReviews(reviews.map(r => r.id === reviewId ? updatedReview : r));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-2xl font-bold text-gray-800">{course.code}</h1>
      <p className="text-gray-600 mb-2">{course.title}</p>

      {averageRating && (
        <div className="mb-4 text-yellow-500 text-lg font-medium">
          {'★'.repeat(Math.floor(averageRating))}
          {'☆'.repeat(5 - Math.floor(averageRating))} ({averageRating} / 5)
        </div>
      )}

{Object.keys(gradeStats).length > 0 && (
  <div className="max-w-2xl mx-auto mt-6 px-4 py-4 bg-white rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
      📈 Grade Distribution
    </h3>
    <div style={{ height: '250px' }}>
      <Bar
        data={{
          labels: allGrades,
          datasets: [
            {
              label: 'Reported Grades',
              data: allGrades.map((grade) => gradeStats[grade] || 0),
              backgroundColor: '#FFC72C', // GMU Gold
              barThickness: 30, // consistent width
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: '#6B7280', // text-gray-500
              },
              grid: {
                color: '#E5E7EB', // gray-200
              },
            },
            x: {
              ticks: {
                color: '#374151', // gray-700
              },
              grid: {
                display: false,
              },
            },
          },
        }}
      />
    </div>
  </div>
)}



<hr className="mb-6 border-t border-gray-200" />
<h3 className="text-xl font-semibold mt-10 mb-4 text-gray-800">
  Anonymous Reviews
</h3>


      {reviews.map((r, i) => (
        <div key={i} className="p-4 border rounded-xl bg-gray-50 mb-4">
          <p className="text-sm">
            <strong>Professor:</strong> {r.professor} | <strong>Grade:</strong> {r.grade} | <strong>Tough Grader:</strong> {r.tough_grader}
          </p>
          <p className="text-xs text-gray-500 mt-1">by {r.reviewer_display_name || "Anonymous"}</p>
          <p className="mt-2 text-gray-800">{r.review_text}</p>

          {r.rating && (
            <div className="mt-1 text-yellow-500 text-sm">
              {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
            </div>
          )}

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => handleVote(r.id, "upvotes")}
              className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
            >
              👍 {r.upvotes || 0}
            </button>
            <button
              onClick={() => handleVote(r.id, "downvotes")}
              className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
            >
              👎 {r.downvotes || 0}
            </button>
            <p className="text-sm text-gray-600 ml-2">
              Helpfulness: {(r.upvotes || 0) - (r.downvotes || 0)}
            </p>
          </div>

          <div className="ml-4 mt-4 space-y-1">
            {r.replies.map((reply, ri) => (
              <div key={ri} className="text-sm text-gray-700 border-l pl-3">
                <strong>{reply.user || "Anonymous"}</strong>: {reply.text}
              </div>
            ))}
          </div>

          {user && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const input = e.target.replyText.value;
                if (!input.trim()) return;
                await addDoc(collection(db, `reviews/${r.id}/replies`), {
                  text: input,
                  user: "Anonymous",
                  created_at: serverTimestamp()
                });
                window.location.reload();
              }}
              className="mt-2 flex gap-2"
            >
              <input
                type="text"
                name="replyText"
                placeholder="Reply..."
                className="border rounded p-1 w-full text-sm"
              />
              <button type="submit" className="bg-blue-500 text-white px-2 rounded text-sm">
                Reply
              </button>
            </form>
          )}
        </div>
      ))}

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Leave a Review</h3>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Professor Name"
            value={form.professor}
            onChange={(e) => setForm({ ...form, professor: e.target.value })}
            required
          />
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Grade Achieved"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tough Grader?
            </label>
            <select
  className="w-full border p-2 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
  value={form.toughGrader}
              onChange={(e) => setForm({ ...form, toughGrader: e.target.value })}
            >
                <option value="">Select an option</option> 
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Rating
            </label>
            <div className="flex gap-1 text-2xl text-yellow-400 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setForm({ ...form, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {star <= (hoverRating || form.rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
          <textarea
            className="w-full border p-2 rounded"
            rows="4"
            placeholder="Your Review"
            value={form.reviewText}
            onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </form>
      ) : (
        <p className="text-red-600 mt-4">Please log in to leave a review or reply.</p>
      )}
    </div>
  );
}
