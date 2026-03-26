import { useEffect, useState } from "react";
import { getStudents, updateStudent } from "../services/api";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

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

  return (
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

      {message ? <p className="success-text">{message}</p> : null}
    </div>
  );
}
