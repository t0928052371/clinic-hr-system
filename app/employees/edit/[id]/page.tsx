"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();

  // 🔥 強制轉數字（避免抓不到 ID）
  const employeeId = Number(params.id);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState("在職");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔥 讀取員工資料
  useEffect(() => {
    const fetchEmployee = async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", employeeId)
        .single();

      if (error) {
        alert("讀取失敗");
        router.push("/employees");
        return;
      }

      setName(data.name || "");
      setPosition(data.position || "");
      setBranch(data.branch || "");
      setStatus(data.status || "在職");

      setLoading(false);
    };

    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId, router]);

  // 🔥 更新員工
  const handleUpdate = async () => {
    if (!name || !position || !branch || !status) {
      alert("請先填完整資料");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("employees")
      .update({
        name,
        position,
        branch,
        status,
      })
      .eq("id", employeeId)
      .select(); // 🔥 這行很重要

    setSaving(false);

    if (error) {
      alert(`更新失敗：${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      alert("沒有更新到資料（ID可能錯誤）");
      return;
    }

    alert("更新成功");
    router.push("/employees");
    router.refresh();
  };

  if (loading) {
    return (
      <main style={{ padding: "40px" }}>
        讀取中...
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>編輯員工</h1>

      <div style={{ marginTop: "20px" }}>
        <label>姓名</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>職稱</label>
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>分院</label>
        <input
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>狀態</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
        >
          <option value="在職">在職</option>
          <option value="離職">離職</option>
          <option value="留停">留停</option>
        </select>
      </div>

      <button
        onClick={handleUpdate}
        disabled={saving}
        style={{
          marginTop: "30px",
          padding: "10px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {saving ? "儲存中..." : "儲存修改"}
      </button>
    </main>
  );
}