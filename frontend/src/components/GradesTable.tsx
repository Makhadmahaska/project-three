type GradeRow = {
  id: string;
  course?: string;
  subject?: string | { name?: string };
  grade?: string;
  value?: number;
  year?: number;
};

type GradesTableProps = {
  grades: GradeRow[];
};

export default function GradesTable({ grades }: GradesTableProps) {
  return (
    <table className="grades-table">
      <thead>
        <tr>
          <th>Course</th>
          <th>Subject</th>
          <th>Grade</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
        {grades.map((g) => (
          <tr key={g.id}>
            <td>{g.course ?? "Course"}</td>
            <td>{typeof g.subject === "string" ? g.subject : g.subject?.name ?? "Subject"}</td>
            <td className="grade">{g.grade ?? g.value ?? "-"}</td>
            <td>{g.year ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
