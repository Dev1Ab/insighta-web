import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Account</h1>

      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
    </div>
  );
}