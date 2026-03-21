
import { useState } from "react";
import { registerGrade } from "../services/api";

export default function RegisterGrades() {
  const [form, setForm] = useState({
    student: "",
    course: "",
    subject: "",
    grade: "",
    year: 1,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await registerGrade(form);
    alert("Grade registered");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Register Grades</h2>

      <input placeholder="Student Name" onChange={(e) => setForm({ ...form, student: e.target.value })} />
      <input placeholder="Course" onChange={(e) => setForm({ ...form, course: e.target.value })} />
      <input placeholder="Subject" onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      <input placeholder="Grade" onChange={(e) => setForm({ ...form, grade: e.target.value })} />
      <input placeholder="Year" type="number" onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />

      <button>Save</button>
    </form>
  );
}