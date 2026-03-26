import { useState } from "react";
import AdminGrades from "./AdminGrades";
import RegisterGrades from "./RegisterGrades";
import StudentAccounts from "./StudentAccounts";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

type AdminDashboardProps = {
  token: string;
};

export default function AdminDashboard({ token }: AdminDashboardProps) {
  const [page, setPage] = useState("grades");

  return (
    <div className="dashboard">
      <Navbar title="Admin Dashboard" subtitle="Administration" />

      <div className="dashboard-layout">
        <Sidebar
          items={[
            { label: "Login", onClick: () => setPage("grades") },
            { label: "Register Grades", active: page === "grades", onClick: () => setPage("grades") },
            { label: "Student Accounts", active: page === "students", onClick: () => setPage("students") },
            { label: "My Grades", active: page === "all-grades", onClick: () => setPage("all-grades") }
          ]}
        />

        <div className="content">
          <div className="content-panel">
            <div className="section-header">
              <div>
                <h1>Administration</h1>
                <p className="section-copy">Manage grades and student records in the same wireframe layout.</p>
              </div>
            </div>

            {page === "grades" && <RegisterGrades token={token} />}
            {page === "students" && <StudentAccounts token={token} />}
            {page === "all-grades" && <AdminGrades token={token} />}
          </div>
        </div>
      </div>
    </div>
  );
}
