"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function NewEmployeePage() {
  const [name, setName] = useState("");
  const [branches, setBranches] = useState<any[]>([]);
  const [branchId, setBranchId] = useState("");

  // 👉 抓分院資料
  useEffect(() => {
    const fetchBranches = async () => {
      const { data, error } = await supabase
        .from("branches")
        .select("*");

      if (error) {
        console.error("抓分院錯誤:", error);
      } else {
        console.log("分院資料:", data);
        setBranches(data || []);
      }
    };

    fetchBranches();
  }, []);

  // 👉 新增員工
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase.from("employees").insert([
      {
        name,
        branch_id: branchId || null,
      },
    ]);

    if (error) {
      alert("新增失敗");
      console.error(error);
    } else {
      alert("新增成功");
      setName("");
      setBranchId("");
    }
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>新增員工</h1>

      <form onSubmit={handleSubmit}>
        {/* 員工名稱 */}
        <div style={{ marginBottom: "20px" }}>
          <label>姓名：</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </div>

        {/* 分院下拉 */}
        <div style={{ marginBottom: "20px" }}>
          <label>分院：</label>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">請選擇分院</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">新增</button>
      </form>
    </main>
  );
}