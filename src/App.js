import React, { useState, useEffect } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { CommunicationProvider } from "./context/data";
import AdminModule from "./routes/adminModule";
import UserDashboard from "./routes/userDashboard";
import CalendarView from "./components/notificationCalander";
import CompanyListPage from "./routes/companies";
import Login from "./routes/Login";
import Register from "./routes/Register";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setIsAuthenticated(true);
    setUserRole(role);
    navigate("/");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <CommunicationProvider>
      <div className="app-container">
        <nav className="main-navigation">
          <div className="logo">Calendar App</div>
          <ul className="nav-links">
            {!isAuthenticated ? (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/">Dashboard</Link>
                </li>
                {userRole === "admin" && (
                  <li>
                    <Link to="/admin">Add Company</Link>
                  </li>
                )}
                <li>
                  <Link to="/company">Company List</Link>
                </li>
                <li>
                  <Link to="/calendar">Calendar</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  userRole === "admin" ? (
                    <AdminModule />
                  ) : (
                    <UserDashboard />
                  )
                ) : (
                  <Login handleLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/admin"
              element={
                isAuthenticated && userRole === "admin" ? (
                  <AdminModule />
                ) : (
                  <Login handleLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <UserDashboard />
                ) : (
                  <Login handleLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/calendar"
              element={isAuthenticated ? <CalendarView /> : <Login handleLogin={handleLogin} />}
            />
            <Route
              path="/company"
              element={isAuthenticated ? <CompanyListPage /> : <Login handleLogin={handleLogin} />}
            />
          </Routes>
        </main>
      </div>
    </CommunicationProvider>
  );
}

export default App;