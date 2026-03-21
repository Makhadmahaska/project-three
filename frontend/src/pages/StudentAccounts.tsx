
import { useEffect, useState } from "react";
import { getStudents } from "../services/api";

export default function StudentAccounts() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  return (
    <div className="table-container">
      <h2>Student Accounts</h2>

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
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
