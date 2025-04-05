import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import {
  FaBookOpen,
  FaGraduationCap,
  FaCalculator,
  FaTrash,
  FaEdit,
  FaSave,
  FaStar
} from "react-icons/fa";
import gmuCourses from "../assets/gmu_cs_courses.json";

const gradePoints = {
  "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0,
  "B-": 2.7, "C+": 2.3, "C": 2.0, "D": 1.0, "F": 0.0
};

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    code: "", name: "", grade: "", credits: "", semester: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [engagementScore, setEngagementScore] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const userRef = doc(db, "users", user);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) setCourses(docSnap.data().courses || []);

      const q = query(collection(db, "reviews"), where("reviewer_email", "==", user));
      const snap = await getDocs(q);
      const reviewData = snap.docs.map(doc => doc.data());
      setReviews(reviewData);

      let score = 0;
      reviewData.forEach(r => {
        score += 10;
        score += (r.upvotes || 0) * 2;
        score -= (r.downvotes || 0);
      });
      setEngagementScore(score);
    };

    fetchData();
  }, [user]);

  const saveCoursesToDB = async (updatedCourses) => {
    const userRef = doc(db, "users", user);
    await setDoc(userRef, { courses: updatedCourses }, { merge: true });
  };

  const handleAdd = async () => {
    if (!form.code || !form.name || !form.grade || !form.credits || !form.semester) return;
    const newCourse = { ...form, credits: parseFloat(form.credits) };
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    await saveCoursesToDB(updatedCourses);
    setForm({ code: "", name: "", grade: "", credits: "", semester: "" });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setForm(courses[index]);
  };

  const handleSave = async () => {
    const updated = [...courses];
    updated[editingIndex] = form;
    setCourses(updated);
    await saveCoursesToDB(updated);
    setForm({ code: "", name: "", grade: "", credits: "", semester: "" });
    setEditingIndex(null);
  };

  const handleDelete = async (index) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
    await saveCoursesToDB(updated);
  };

  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/gi, "");

  const calculateGPA = () => {
    const valid = courses.filter((c) => gradePoints[c.grade]);
    const totalPoints = valid.reduce((sum, c) => sum + gradePoints[c.grade] * c.credits, 0);
    const totalCredits = valid.reduce((sum, c) => sum + c.credits, 0);
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : "N/A";
  };

  const gpa = calculateGPA();
  const gpaPercent = gpa === "N/A" ? 0 : (parseFloat(gpa) / 4) * 100;
  const semesters = [...new Set(courses.map((c) => c.semester))];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">🔐 Please log in to access your dashboard.</h2>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">🎓 Student Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-4">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded ${activeTab === "courses" ? "bg-[#006633] text-white" : "bg-gray-200"}`}
        >
          Your Courses
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 rounded ${activeTab === "reviews" ? "bg-[#006633] text-white" : "bg-gray-200"}`}
        >
          Your Reviews
        </button>
      </div>

      {activeTab === "courses" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-yellow-400 text-black p-5 rounded-2xl shadow text-center">
              <FaGraduationCap size={24} className="mx-auto mb-1" />
              <p className="text-xl font-semibold">Courses Taken</p>
              <p className="text-3xl font-bold">{courses.length}</p>
            </div>

            <div className="bg-green-400 text-black p-5 rounded-2xl shadow text-center">
              <FaBookOpen size={24} className="mx-auto mb-1" />
              <p className="text-xl font-semibold">Latest Course</p>
              <p className="text-lg">{courses.length ? courses[courses.length - 1].code : "—"}</p>
            </div>

            <div className="bg-blue-400 text-white p-5 rounded-2xl shadow text-center flex flex-col items-center justify-center">
              <FaCalculator size={24} className="mb-2" />
              <p className="text-lg font-medium">GPA</p>
              <div className="relative w-24 h-24 mt-2">
                <svg className="absolute top-0 left-0 w-full h-full">
                  <circle
                    className="text-blue-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="36"
                    cx="48"
                    cy="48"
                  />
                  <circle
                    className="text-white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="36"
                    cx="48"
                    cy="48"
                    strokeDasharray={2 * Math.PI * 36}
                    strokeDashoffset={
                      2 * Math.PI * 36 * (1 - Math.min(parseFloat(gpa) / 4.0, 1))
                    }
                  />
                </svg>
                <span className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
                  {gpa}
                </span>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white p-6 rounded shadow mb-10">
            <h2 className="text-xl font-semibold mb-4">
              {editingIndex !== null ? "✏️ Edit Course" : "➕ Add a Course"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input
                className="p-2 border rounded"
                placeholder="Course Code (e.g., CS 321)"
                value={form.code}
                onChange={(e) => {
                  const code = e.target.value;
                  const match = gmuCourses.find(c => normalize(c.code) === normalize(code));
                  setForm({
                    ...form,
                    code,
                    name: match ? match.title : ""
                  });
                }}
              />
              <input
                className="p-2 border rounded"
                placeholder="Course Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="p-2 border rounded"
                placeholder="Grade"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="number"
                className="p-2 border rounded"
                placeholder="Credits"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: e.target.value })}
              />
              <input
                className="p-2 border rounded"
                placeholder="Semester (e.g., Fall 2024)"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              />
            </div>
            {editingIndex !== null ? (
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
              >
                <FaSave className="inline-block mr-2" /> Save
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="bg-[#006633] hover:bg-green-700 text-white px-6 py-2 rounded transition"
              >
                Add Course
              </button>
            )}
          </div>

          {/* Group by Semester */}
          {semesters.map((sem, i) => (
            <div key={i} className="mb-8">
              <h3 className="text-lg font-bold mb-3">📆 {sem}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {courses
                  .filter((c) => c.semester === sem)
                  .map((c, j) => (
                    <div key={j} className="bg-gray-100 border rounded p-4 relative">
                      <h4 className="text-lg font-semibold">{c.code}</h4>
                      <p className="text-sm text-gray-700">{c.name}</p>
                      <p className="text-sm mt-1">Grade: {c.grade} | Credits: {c.credits}</p>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button onClick={() => handleEdit(courses.indexOf(c))} className="text-blue-500"><FaEdit /></button>
                        <button onClick={() => handleDelete(courses.indexOf(c))} className="text-red-500"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </>
      )}

      {activeTab === "reviews" && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-bold mb-4">🗣️ Your Reviews</h2>

          <div className="bg-purple-100 text-purple-800 rounded-full w-fit px-6 py-2 mb-4 text-sm font-semibold shadow inline-block">
            Engagement Score: {engagementScore}
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-gray-50 p-4 border rounded-xl">
                  <p className="text-sm mb-1">
                    <strong>
                      {r.target_type === "course" ? r.course : `Professor ID: ${r.target_id}`}
                    </strong>
                  </p>
                  <p className="text-sm text-gray-700">{r.review_text}</p>
                  <div className="mt-1 flex gap-4 text-sm text-gray-600">
                    <span>⭐ {r.rating}</span>
                    <span>👍 {r.upvotes || 0}</span>
                    <span>👎 {r.downvotes || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
