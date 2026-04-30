"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Employee = {
  id: number;
  name: string;
  position: string;
  branch: string;
  status: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("id", { ascending: true });

    if (!error) {
      setEmployees(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🔥 刪除功能
  const handleDelete = async (id: number) => {
    const confirmed = confirm("確定要刪除這位員工嗎？");
    if (!confirmed) return;

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`刪除失敗：${error.message}`);
      return;
    }

    // 前端同步更新
    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== id)
    );

    alert("刪除成功");
  };

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>員工管理</h1>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        管理診所員工資料、職稱、分院與在職狀態。
      </p>

      <a
        href="/employees/new"
        style={{
          display: "inline-block",
          padding: "10px 16px",
          backgroundColor: "black",
          color: "white",
          textDecoration: "none",
          borderRadius: "6px",
          marginBottom: "20px",
        }}
      >
        新增員工
      </a>

      {loading ? (
        <p>讀取中...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>姓名</th>
              <th style={thStyle}>職稱</th>
              <th style={thStyle}>分院</th>
              <th style={thStyle}>狀態</th>
              <th style={thStyle}>操作</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td style={tdStyle}>{employee.id}</td>
                <td style={tdStyle}>{employee.name}</td>
                <td style={tdStyle}>{employee.position}</td>
                <td style={tdStyle}>{employee.branch}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "999px",
                      backgroundColor:
                        employee.status === "在職" ? "#dcfce7" : "#fee2e2",
                      color:
                        employee.status === "在職" ? "#166534" : "#991b1b",
                      fontSize: "14px",
                    }}
                  >
                    {employee.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <a
                    href={`/employees/edit/${employee.id}`}
                    style={{
                      marginRight: "8px",
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                  >
                    編輯
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(employee.id)}
                    style={{
                      color: "#dc2626",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
};