import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profiles() {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    gender: "",
    country_id: "",
    age_group: "",
    min_age: "",
    max_age: "",
    sort_by: "created_at",
    order: "asc",
    page: 1,
    limit: 10,
  });

  async function loadProfiles() {
    setLoading(true);

    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );

    try {
      const res = await api.get("/api/profiles", { params });
      setProfiles(res.data.data);
      setMeta(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfiles();
  }, [filters.page]);

  function updateFilter(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  }

  function applyFilters() {
    loadProfiles();
  }

  async function exportCSV() {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );

    const res = await api.get("/api/profiles/export", {
      params: { ...params, format: "csv" },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "profiles.csv";
    link.click();
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Profiles</h1>

        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded">
            Export CSV
          </button>

          {user?.role === "admin" && (
            <Link to="/profiles/create" className="bg-black text-white px-4 py-2 rounded">
              Create Profile
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-4 gap-3">
        <select name="gender" onChange={updateFilter} className="border p-2 rounded">
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input name="country_id" placeholder="Country ID e.g NG" onChange={updateFilter} className="border p-2 rounded" />

        <select name="age_group" onChange={updateFilter} className="border p-2 rounded">
          <option value="">Age Group</option>
          <option value="child">Child</option>
          <option value="teenager">Teenager</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>

        <button onClick={applyFilters} className="bg-blue-600 text-white rounded">
          Apply Filters
        </button>
      </div>

      {loading ? (
        <p>Loading profiles...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Age Group</th>
                <th>Country</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-3">{p.name}</td>
                  <td>{p.gender}</td>
                  <td>{p.age}</td>
                  <td>{p.age_group}</td>
                  <td>{p.country_id}</td>
                  <td>
                    <Link className="text-blue-600" to={`/profiles/${p.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-4 mt-4 items-center">
        <button
          disabled={filters.page <= 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {meta.page} of {meta.total_pages}
        </span>

        <button
          disabled={filters.page >= meta.total_pages}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}