import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/api/profiles/${id}`);
      setProfile(res.data.data);
    }

    load();
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">{profile.name}</h1>

      <div className="space-y-2">
        <p><strong>Gender:</strong> {profile.gender}</p>
        <p><strong>Gender Probability:</strong> {profile.gender_probability}</p>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Age Group:</strong> {profile.age_group}</p>
        <p><strong>Country ID:</strong> {profile.country_id}</p>
        <p><strong>Country Name:</strong> {profile.country_name}</p>
        <p><strong>Country Probability:</strong> {profile.country_probability}</p>
        <p><strong>Created At:</strong> {profile.created_at}</p>
      </div>
    </div>
  );
}