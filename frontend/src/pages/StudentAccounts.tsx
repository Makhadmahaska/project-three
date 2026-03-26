import { useEffect, useState } from "react";
import { getStudents } from "../services/api";

type StudentRow = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
};

export default function StudentAccounts() {
  const [students, setStudents] = useState<StudentRow[]>([]);

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  return (
    <div className="table-container card-panel">
      <div className="section-header compact">
        <div>
          <h2>Student Accounts</h2>
          <p className="section-copy">Overview of the current student records.</p>
        </div>
      </div>

      <table className="grades-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name ?? (`${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || "Student")}</td>
              <td>{s.email ?? "-"}</td>
              <td>{s.phone ?? "-"}</td>
              <td>{s.address ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
