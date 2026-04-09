import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import "./Sidebar.css";

import {
  Dashboard,
  FolderOpen,
  Timeline,
  ViewKanban,
  BugReport,
  AccessTime,
  Logout,
  Menu
} from "@mui/icons-material";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const username = user?.username || "User";
  const firstLetter = username.charAt(0).toUpperCase();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <span className="brand">Taiga</span>

        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu />
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavItem to="/dashboard" icon={<Dashboard />} label="Dashboard" collapsed={collapsed} />
        <NavItem to="/projects" icon={<FolderOpen />} label="Projects" collapsed={collapsed} />
        <NavItem to="/sprints" icon={<Timeline />} label="Sprints" collapsed={collapsed} />
        <NavItem to="/kanban" icon={<ViewKanban />} label="Kanban" collapsed={collapsed} />
        <NavItem to="/issues" icon={<BugReport />} label="Issues" collapsed={collapsed} />
        <NavItem to="/timelogs" icon={<AccessTime />} label="Time Logs" collapsed={collapsed} />
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">{firstLetter}</div>

        {!collapsed && (
          <p className="username">{username}</p>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          <Logout fontSize="small" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label, collapsed }) => (
  <NavLink to={to} className="nav-item">
    <span className="nav-icon">{icon}</span>
    {!collapsed && <span className="nav-text">{label}</span>}
  </NavLink>
);

export default Sidebar;