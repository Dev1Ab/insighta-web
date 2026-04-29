import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
  });

  useEffect(() => {
    async function load() {
      const all = await api.get("/api/profiles?limit=1");
      const male = await api.get("/api/profiles?gender=male&limit=1");
      const female = await api.get("/api/profiles?gender=female&limit=1");

      setStats({
        total: all.data.total,
        male: male.data.total,
        female: female.data.total,
      });
    }

    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Total Profiles" value={stats.total} />
        <Card title="Male Profiles" value={stats.male} />
        <Card title="Female Profiles" value={stats.female} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}