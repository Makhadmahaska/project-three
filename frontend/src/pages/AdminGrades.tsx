import { useEffect, useState } from "react";
import { getGrades } from "../services/api";

type AdminGradesProps = {
  token: string;
};

type AdminGradeRow = {
  id: string;
  value?: number;
  comment?: string | null;
  student?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  subject?: {
    name?: string;
    code?: string;
  };
};

export default function AdminGrades({ token }: AdminGradesProps) {
  const [grades, setGrades] = useState<AdminGradeRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getGrades(token)
      .then(setGrades)
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Failed to load grades");
      });
  }, [token]);

  return (
    <div className="card-panel">
      <div className="section-header compact">
        <div>
          <h2>All Grades</h2>
          <p className="section-copy">Overview of all registered student grades.</p>
        </div>
      </div>

      {error ? (
        <p className="login-error account-error">{error}</p>
      ) : (
        <table className="grades-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Score</th>
              <th>Comment</th>
            </tr>
          </thead>

          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td>{`${grade.student?.firstName ?? ""} ${grade.student?.lastName ?? ""}`.trim() || "Student"}</td>
                <td>{grade.student?.email ?? "-"}</td>
                <td>{grade.subject?.name ?? grade.subject?.code ?? "-"}</td>
                <td>{grade.value ?? "-"}</td>
                <td>{grade.comment ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
