import { useEffect, useState } from "react";
import { getGrades } from "../services/api";
import GradesTable from "../components/GradesTable";
import YearFilter from "../components/YearFilter";
import Navbar from "../components/Navbar";

type StudentDashboardProps = {
  user: {
    name: string;
  };
};

type GradeRow = {
  id: string;
  year?: number;
};

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [year, setYear] = useState(0);

  useEffect(() => {
    getGrades().then(setGrades);
  }, []);

  const filtered = year === 0 ? grades : grades.filter((g) => g.year === year);

  return (
    <div className="dashboard">
      <Navbar title="Student Dashboard" subtitle="Grades" />

      <div className="content">
        <div className="content-panel">
          <div className="section-header">
            <div>
              <h1>Grades</h1>
              <p className="student-name">{user.name}</p>
            </div>
          </div>

          <YearFilter setYear={setYear} />

          <GradesTable grades={filtered} />
        </div>
      </div>
    </div>
  );
}
