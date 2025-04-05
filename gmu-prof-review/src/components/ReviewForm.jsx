import { useState } from "react";

export default function ReviewForm({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="w-full p-2 border rounded"
        rows="3"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write an anonymous review..."
      ></textarea>
      <button
        type="submit"
        className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
      >
        Submit
      </button>
    </form>
  );
}
