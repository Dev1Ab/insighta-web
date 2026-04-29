import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b px-6 py-4 flex justify-between">
        <div className="flex gap-4">
          <Link to="/" className="font-bold">Insighta Labs+</Link>
          <Link to="/profiles">Profiles</Link>
          <Link to="/search">Search</Link>
          <Link to="/account">Account</Link>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-600">
            {user?.username} ({user?.role})
          </span>
          <button onClick={logout} className="text-red-600">
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}