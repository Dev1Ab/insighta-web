import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profiles from "./pages/Profiles";
import ProfileDetail from "./pages/ProfileDetail";
import Search from "./pages/Search";
import Account from "./pages/Account";
import CreateProfile from "./pages/CreateProfile";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profiles" element={<Profiles />} />
            <Route path="profiles/create" element={<CreateProfile />} />
            <Route path="profiles/:id" element={<ProfileDetail />} />
            <Route path="search" element={<Search />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}