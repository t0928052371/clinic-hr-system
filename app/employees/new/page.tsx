"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Branch = {
  id: number;
  name: string;
};

export default function NewEmployeePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState("在職");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      const { data, error } = await supabase
        .from("branches")
        .select("id, name")
        .order("id", { ascending: true });

      if (error) {
        alert(`讀取分院失敗：${error.message}`);
        console.error("讀取分院失敗：", error);
        return;
      }

      alert(`讀到 ${data?.length || 0} 筆分院`);
      console.log("分院資料：", data);

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
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "720px" }}>
      <h1>新增員工</h1>

      <form style={{ marginTop: "24px", display: "grid", gap: "16px" }}>
        <div>
          <label>姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label>職稱</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px", marginTop: "6px" }}
          />
        </div>

        <div>
          <label>分院</label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px", marginTop: "6px" }}
          >
            <option value="">請選擇分院</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>狀態</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px", marginTop: "6px" }}
          >
            <option value="在職">在職</option>
            <option value="離職">離職</option>
            <option value="留停">留停</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          style={{
            padding: "12px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {saving ? "儲存中..." : "儲存員工資料"}
        </button>
      </form>
    </main>
  );
}