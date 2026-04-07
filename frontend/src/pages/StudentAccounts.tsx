import { useEffect, useState } from "react";
import { createStudent, getStudents, updateStudent } from "../services/api";

type StudentRow = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
};

type EditForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type StudentAccountsProps = {
  token: string;
};

export default function StudentAccounts({ token }: StudentAccountsProps) {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [createForm, setCreateForm] = useState<EditForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    getStudents(token)
      .then(setStudents)
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Failed to load students");
      });
  }, [token]);

  const startEdit = (student: StudentRow) => {
    setEditingId(student.id);
    setMessage("");
    setError("");
    setEditForm({
      firstName: student.firstName ?? "",
      lastName: student.lastName ?? "",
      email: student.email ?? "",
      password: ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    });
  };

  const saveEdit = async (studentId: string) => {
    setMessage("");
    setError("");

    try {
      const updatedStudent = await updateStudent(token, studentId, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        ...(editForm.password ? { password: editForm.password } : {})
      });

      setStudents((current) =>
        current.map((student) =>
          student.id === studentId
            ? {
                ...student,
                firstName: updatedStudent.firstName,
                lastName: updatedStudent.lastName,
                email: updatedStudent.email,
              }
            : student
        )
      );

      setMessage("Student updated");
      cancelEdit();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to update student");
    }
  };

  const saveCreate = async () => {
    setMessage("");
    setCreateError("");

    try {
      const createdStudent = await createStudent(token, {
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        email: createForm.email,
        password: createForm.password
      });

      setStudents((current) =>
        [...current, createdStudent].sort((a, b) =>
          `${a.firstName ?? ""} ${a.lastName ?? ""}`.localeCompare(
            `${b.firstName ?? ""} ${b.lastName ?? ""}`
          )
        )
      );
      setCreateForm({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      });
      setMessage("Student created");
    } catch (saveError) {
      setCreateError(saveError instanceof Error ? saveError.message : "Failed to create student");
    }
  };

  return (
    <div className="admin-workspace">
      <div className="card-panel">
        <div className="section-header compact">
          <div>
            <h2>Add Student</h2>
            <p className="section-copy">Create a student account that can later receive subjects and grades.</p>
          </div>
        </div>

        <div className="stack-fields">
          <label className="line-field">
            <span>First Name</span>
            <input
              value={createForm.firstName}
              onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
            />
          </label>
          <label className="line-field">
            <span>Last Name</span>
            <input
              value={createForm.lastName}
              onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
            />
          </label>
          <label className="line-field">
            <span>Email</span>
            <input
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            />
          </label>
          <label className="line-field">
            <span>Password</span>
            <input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            />
          </label>
        </div>

        <button type="button" className="primary-button" onClick={saveCreate}>Add Student</button>
        {createError ? <p className="login-error account-error">{createError}</p> : null}
        {message ? <p className="success-text">{message}</p> : null}
      </div>

      <div className="table-container card-panel">
        <div className="section-header compact">
          <div>
            <h2>Student Accounts</h2>
            <p className="section-copy">Overview of the current student records.</p>
          </div>
        </div>

        {error ? (
          <p className="login-error account-error">{error}</p>
        ) : (
          <table className="grades-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>
                    {editingId === s.id ? (
                      <div className="table-edit-grid">
                        <input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          placeholder="First name"
                        />
                        <input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          placeholder="Last name"
                        />
                      </div>
                    ) : (
                      s.name ?? (`${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || "Student")
                    )}
                  </td>
                  <td>
                    {editingId === s.id ? (
                      <input
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Email"
                      />
                    ) : (
                      s.email ?? "-"
                    )}
                  </td>
                  <td>
                    {editingId === s.id ? (
                      <input
                        type="password"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        placeholder="New password"
                      />
                    ) : (
                      "Leave blank to keep"
                    )}
                  </td>
                  <td>
                    {editingId === s.id ? (
                      <div className="table-actions">
                        <button type="button" onClick={() => saveEdit(s.id)}>Save</button>
                        <button type="button" onClick={cancelEdit}>Cancel</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => startEdit(s)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
