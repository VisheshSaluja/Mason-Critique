import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import {
  FaBookOpen,
  FaGraduationCap,
  FaCalculator,
  FaTrash,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import gmuCourses from "../assets/gmu_cs_courses.json";

const gradePoints = {
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "D": 1.0,
  "F": 0.0
};

export default function Dashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    grade: "",
    credits: "",
    semester: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      const userRef = doc(db, "users", user);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setCourses(docSnap.data().courses || []);
      }
    };
    fetchCourses();
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
    setForm({ code: "", name: "", grade: "", credits: "", semester: "" });
    await saveCoursesToDB(updatedCourses);
  };

  const handleDelete = async (index) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
    await saveCoursesToDB(updated);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setForm(courses[index]);
  };

  const handleSave = async () => {
    const updatedCourses = [...courses];
    updatedCourses[editingIndex] = form;
    setCourses(updatedCourses);
    await saveCoursesToDB(updatedCourses);
    setForm({ code: "", name: "", grade: "", credits: "", semester: "" });
    setEditingIndex(null);
  };

  const calculateGPA = () => {
    const valid = courses.filter((c) => gradePoints[c.grade]);
    const totalPoints = valid.reduce((sum, c) => sum + gradePoints[c.grade] * c.credits, 0);
    const totalCredits = valid.reduce((sum, c) => sum + c.credits, 0);
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : "N/A";
  };

  const semesters = [...new Set(courses.map((c) => c.semester))];

  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/gi, "");

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
    <div className="max-w-5xl mx-auto px-6 py-24 text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center">🎓 Student Dashboard</h1>

      {/* GPA + Stats */}
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
        <div className="bg-blue-400 text-black p-5 rounded-2xl shadow text-center">
          <FaCalculator size={24} className="mx-auto mb-1" />
          <p className="text-xl font-semibold">GPA</p>
          <p className="text-3xl font-bold">{calculateGPA()}</p>
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
            placeholder="Grade (A, B+, etc.)"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Credits (e.g., 3)"
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
            <FaSave className="inline-block mr-2" /> Save Changes
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

      {/* Grouped by Semester */}
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
                    <button
                      onClick={() => handleEdit(courses.indexOf(c))}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(courses.indexOf(c))}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
