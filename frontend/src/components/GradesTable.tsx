
export default function GradesTable({ grades }: any) {
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
        {grades.map((g: any) => (
          <tr key={g.id}>
            <td>{g.course}</td>
            <td>{g.subject}</td>
            <td className="grade">{g.grade}</td>
            <td>{g.year}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}