
import { useEffect, useState } from "react";
import { getGrades } from "../services/api";
import GradesTable from "../components/GradesTable";
import YearFilter from "../components/YearFilter";
import Navbar from "../components/Navbar";

export default function StudentDashboard({ user }: any) {
  const [grades, setGrades] = useState<any[]>([]);
  const [year, setYear] = useState(0);

  useEffect(() => {
    getGrades().then(setGrades);
  }, []);

  const filtered = year === 0 ? grades : grades.filter((g) => g.year === year);

  return (
    <div className="dashboard">
      <Navbar />

      <div className="content">
        <h1>Grades</h1>
        <p className="student-name">{user.name}</p>

        <YearFilter setYear={setYear} />

        <GradesTable grades={filtered} />
      </div>
    </div>
  );
}