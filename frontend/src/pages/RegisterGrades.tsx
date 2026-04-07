import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  createSubject,
  getStudents,
  getSubjects,
  registerGrade,
  type SubjectOption
} from "../services/api";

type RegisterGradesProps = {
  token: string;
};

type StudentOption = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export default function RegisterGrades({ token }: RegisterGradesProps) {
  const [form, setForm] = useState({
    studentId: "",
    subjectId: "",
    value: 0,
    comment: "",
  });
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    description: ""
  });
  const [subjectMessage, setSubjectMessage] = useState("");
  const [subjectError, setSubjectError] = useState("");

  useEffect(() => {
    void Promise.all([getStudents(token), getSubjects(token)])
      .then(([studentData, subjectData]) => {
        setStudents(studentData);
        setSubjects(subjectData);
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Failed to load form options");
      });
  }, [token]);

  const handleChange = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = key === "value" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [key]: value });
  };

  const handleSelectChange = (key: "studentId" | "subjectId") => (e: ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubjectChange =
    (key: keyof typeof subjectForm) => (e: ChangeEvent<HTMLInputElement>) => {
      setSubjectForm({ ...subjectForm, [key]: e.target.value });
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await registerGrade(token, {
        studentId: form.studentId,
        subjectId: form.subjectId,
        value: form.value,
        comment: form.comment || undefined
      });
      setMessage("Grade registered");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to register grade");
    }
  };

  const handleSubjectSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubjectMessage("");
    setSubjectError("");

    try {
      const subject = await createSubject(token, {
        name: subjectForm.name,
        code: subjectForm.code,
        description: subjectForm.description || undefined
      });

      setSubjects((current) => [...current, subject].sort((a, b) => a.name.localeCompare(b.name)));
      setForm((current) => ({ ...current, subjectId: subject.id }));
      setSubjectForm({ name: "", code: "", description: "" });
      setSubjectMessage("Subject added");
    } catch (saveError) {
      setSubjectError(saveError instanceof Error ? saveError.message : "Failed to create subject");
    }
  };

  return (
    <div className="admin-workspace">
      <form className="form card-panel" onSubmit={handleSubmit}>
        <div className="section-header compact">
          <div>
            <h2>Register Grades</h2>
            <p className="section-copy">Fill in the student result details and save them to the system.</p>
          </div>
        </div>

        <div className="stack-fields">
          <label className="line-field">
            <span>Student</span>
            <select value={form.studentId} onChange={handleSelectChange("studentId")}>
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {`${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || student.email || student.id}
                </option>
              ))}
            </select>
          </label>

          <label className="line-field">
            <span>Subject</span>
            <select value={form.subjectId} onChange={handleSelectChange("subjectId")}>
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </label>

          <label className="line-field">
            <span>Score</span>
            <input value={form.value} type="number" min="0" max="100" onChange={handleChange("value")} />
          </label>

          <label className="line-field">
            <span>Comment</span>
            <input value={form.comment} onChange={handleChange("comment")} />
          </label>
        </div>

        <button className="primary-button" type="submit">Save</button>
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="login-error account-error">{error}</p> : null}
      </form>

      <form className="form card-panel" onSubmit={handleSubjectSubmit}>
        <div className="section-header compact">
          <div>
            <h2>Add Subject</h2>
            <p className="section-copy">Create a subject here, then it will appear in the grade form right away.</p>
          </div>
        </div>

        <div className="stack-fields">
          <label className="line-field">
            <span>Subject Name</span>
            <input value={subjectForm.name} onChange={handleSubjectChange("name")} />
          </label>

          <label className="line-field">
            <span>Code</span>
            <input value={subjectForm.code} onChange={handleSubjectChange("code")} />
          </label>

          <label className="line-field">
            <span>Description</span>
            <input value={subjectForm.description} onChange={handleSubjectChange("description")} />
          </label>
        </div>

        <button className="primary-button" type="submit">Add Subject</button>
        {subjectMessage ? <p className="success-text">{subjectMessage}</p> : null}
        {subjectError ? <p className="login-error account-error">{subjectError}</p> : null}
      </form>
    </div>
  );
}
