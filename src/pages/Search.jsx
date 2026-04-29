import { useState } from "react";
import api from "../api/axios";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  async function search(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.get("/api/profiles/search", {
        params: { q },
      });

      setResults(res.data.data);
    } catch (err) {
      setResults([]);
      setMessage(err.response?.data?.message || "Search failed");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Natural Language Search</h1>

      <form onSubmit={search} className="bg-white rounded-xl shadow p-4 flex gap-3 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="young males from nigeria"
          className="border p-2 rounded flex-1"
        />

        <button className="bg-black text-white px-4 rounded">
          Search
        </button>
      </form>

      {message && <p className="text-red-600 mb-4">{message}</p>}

      <div className="bg-white rounded-xl shadow">
        {results.map((p) => (
          <div key={p.id} className="border-b p-4">
            <h2 className="font-bold">{p.name}</h2>
            <p className="text-gray-600">
              {p.gender} • {p.age} • {p.age_group} • {p.country_id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}