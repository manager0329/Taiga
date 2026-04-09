import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStats } from "../services/dashboardService";
import "./Dashboard.css";

import {
  FolderOpen,
  Timeline,
  TaskAlt,
  BugReport,
  AccessTime
} from "@mui/icons-material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = [
  "#4f46e5", // Projects
  "#f59e0b", // Sprints
  "#ec4899", // Tasks
  "#8b5cf6", // Issues
  "#10b981"  // TimeLogs
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    projects: 0,
    sprints: 0,
    tasks: 0,
    issues: 0,
    timelogs: 0
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getStats();
        setStats(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const quickCards = [
    { title: "Projects", value: stats.projects, icon: <FolderOpen />, color: "blue", path: "/projects" },
    { title: "Sprints", value: stats.sprints, icon: <Timeline />, color: "yellow", path: "/sprints" },
    { title: "Tasks", value: stats.tasks, icon: <TaskAlt />, color: "pink", path: "/Kanban" },
    { title: "Issues", value: stats.issues, icon: <BugReport />, color: "purple", path: "/issues" }
  ];

  const pieData = [
    { name: "Projects", value: stats.projects },
    { name: "Sprints", value: stats.sprints },
    { name: "Tasks", value: stats.tasks },
    { name: "Issues", value: stats.issues },
    { name: "TimeLogs", value: stats.timelogs }
  ];

  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-glass">

        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>

        <div className="dashboard-grid">

          {/* LEFT SECTION */}
          <div className="left-section">
            <h4 className="section-title" >Quick Access</h4>

            <div className="quick-grid">
              {quickCards.map((card, index) => (
                <div
                  key={index}
                  className={`quick-card ${card.color}`}
                  onClick={() => navigate(card.path)}
                >
                  <div className="quick-icon">{card.icon}</div>
                  <h3>{loading ? "..." : card.value}</h3>
                  <p>{card.title}</p>
                </div>
              ))}
            </div>
            {/* TIME LOGS SECTION */}
<div className="timelogs-box">

  <AccessTime className="timelog-icon" />
  <h4 className="section-title">Time Logs Information</h4>
  
  <div className="timelog-stats">
    <div>
      <p>Total Logged</p>
      <strong>{stats.timelogs} hrs</strong>
    </div>
    <div>
      <p>Average / Sprint</p>
      <strong>
        {stats.sprints > 0
          ? (stats.timelogs / stats.sprints).toFixed(1)
          : 0} hrs
      </strong>
    </div>
  </div>

  <div className="timelog-progress-bar">
    <div
      className="timelog-progress"
      style={{
        width: `${Math.min(stats.timelogs * 5, 100)}%`
      }}
    ></div>
  </div>
</div>
          </div>

          {/* RIGHT SECTION - MULTI SEGMENT PIE */}
          <div className="right-section">

            <div className="activity-chart">
              <h3>Project Distribution Overview</h3>

              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={4}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

             

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;