import { useEffect, useState } from "react";
import { getOwnGrades } from "../services/api";
import GradesTable from "../components/GradesTable";
import YearFilter from "../components/YearFilter";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

type StudentDashboardProps = {
  token: string;
  user: {
    name: string;
  };
};

type GradeRow = {
  id: string;
  subject?: { name?: string };
  value?: number;
  year?: number;
};

export default function StudentDashboard({ token, user }: StudentDashboardProps) {
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [year, setYear] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    getOwnGrades(token)
      .then((student) => {
        setGrades(
          student.grades.map((grade) => ({
            id: grade.id,
            subject: { name: grade.subject.name },
            value: grade.value,
            year: grade.createdAt ? new Date(grade.createdAt).getFullYear() : undefined
          }))
        );
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Failed to load grades");
      });
  }, [token]);

  const availableYears = Array.from(new Set(grades.map((g) => g.year).filter(Boolean))) as number[];
  const filtered = year === 0 ? grades : grades.filter((g) => g.year === year);

  return (
    <div className="dashboard">
      <Navbar title="Student Dashboard" subtitle="Grades" />

      <div className="dashboard-layout">
        <Sidebar
          items={[
            { label: "Login" },
            { label: "My Grades", active: true },
            { label: "All Years", onClick: () => setYear(0) },
            { label: "Year 1", onClick: () => setYear(1) },
            { label: "Year 2", onClick: () => setYear(2) },
            { label: "Year 3", onClick: () => setYear(3) }
          ]}
        />

        <div className="content">
          <div className="content-panel">
            <div className="section-header">
              <div>
                <h1>Grades</h1>
                <p className="student-name">{user.name}</p>
              </div>
            </div>

            {availableYears.length > 0 ? <YearFilter setYear={setYear} /> : null}

            {error ? <p className="login-error account-error">{error}</p> : <GradesTable grades={filtered} />}
          </div>
        </div>
      </div>
    </div>
  );
}
