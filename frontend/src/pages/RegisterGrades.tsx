import { useState, type ChangeEvent, type FormEvent } from "react";
import { registerGrade } from "../services/api";

export default function RegisterGrades() {
  const [form, setForm] = useState({
    student: "",
    course: "",
    subject: "",
    grade: "",
    year: 1,
  });

  const handleChange = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = key === "year" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await registerGrade(form);
    alert("Grade registered");
  };

  return (
    <form className="form card-panel" onSubmit={handleSubmit}>
      <div className="section-header compact">
        <div>
          <h2>Register Grades</h2>
          <p className="section-copy">Fill in the student result details and save them to the system.</p>
        </div>
      </div>

      <div className="stack-fields">
        <label className="line-field">
          <span>Student Name</span>
          <input value={form.student} onChange={handleChange("student")} />
        </label>

        <label className="line-field">
          <span>Course</span>
          <input value={form.course} onChange={handleChange("course")} />
        </label>

        <label className="line-field">
          <span>Subject</span>
          <input value={form.subject} onChange={handleChange("subject")} />
        </label>

        <label className="line-field">
          <span>Grade</span>
          <input value={form.grade} onChange={handleChange("grade")} />
        </label>

        <label className="line-field">
          <span>Year</span>
          <input value={form.year} type="number" onChange={handleChange("year")} />
        </label>
      </div>

      <button className="primary-button" type="submit">Save</button>
    </form>
  );
}
