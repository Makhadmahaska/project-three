import { useState } from "react";
import RegisterGrades from "./RegisterGrades";
import StudentAccounts from "./StudentAccounts";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [page, setPage] = useState("grades");

  return (
    <div className="dashboard">
      <Navbar title="Admin Dashboard" subtitle="Administration" />

      <div className="content">
        <div className="content-panel">
          <div className="section-header">
            <div>
              <h1>Administration</h1>
              <p className="section-copy">Manage grades and student records in the same wireframe layout.</p>
            </div>
          </div>

          <div className="admin-menu">
            <button onClick={() => setPage("grades")} className={page === "grades" ? "active" : ""}>
              Register Grades
            </button>
            <button onClick={() => setPage("students")} className={page === "students" ? "active" : ""}>
              Student Accounts
            </button>
          </div>

          {page === "grades" && <RegisterGrades />}
          {page === "students" && <StudentAccounts />}
        </div>
      </div>
    </div>
  );
}
