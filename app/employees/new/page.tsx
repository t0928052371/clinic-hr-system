"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function NewEmployeePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState("在職");

  // 🔥 分院資料
  const [branches, setBranches] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);

  // 🔥 抓分院
  useEffect(() => {
    const fetchBranches = async () => {
      const { data } = await supabase.from("branches").select("*");
      setBranches(data || []);
    };

    fetchBranches();
  }, []);

  const handleSubmit = async () => {
    if (!name || !position || !branch || !status) {
      alert("請先填完整資料");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("employees").insert([
      {
        name,
        position,
        branch,
        status,
      },
    ]);

    setSaving(false);

    if (error) {
      alert(`新增失敗：${error.message}`);
      return;
    }

    alert("新增成功");
    router.push("/employees");
    router.refresh();
  };

  return (
    <main style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>新增員工</h1>

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

        {/* 🔥 下拉選單 */}
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
        >
          <option value="">請選擇分院</option>
          {branches.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
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
        onClick={handleSubmit}
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
        {saving ? "儲存中..." : "儲存員工資料"}
      </button>
    </main>
  );
}