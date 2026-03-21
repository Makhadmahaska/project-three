
import { useState } from "react";
import RegisterGrades from "./RegisterGrades";
import StudentAccounts from "./StudentAccounts";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [page, setPage] = useState("grades");

  return (
    <div className="dashboard">
      <Navbar />

      <div className="admin-menu">
        <button onClick={() => setPage("grades")}>Register Grades</button>
        <button onClick={() => setPage("students")}>Student Accounts</button>
      </div>

      {page === "grades" && <RegisterGrades />}
      {page === "students" && <StudentAccounts />}
    </div>
  );
}
