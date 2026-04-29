import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateProfile() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/api/profiles", { name });
      navigate("/profiles");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile");
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Create Profile</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={submit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Harriet Tubman"
          className="border p-3 rounded w-full mb-4"
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}