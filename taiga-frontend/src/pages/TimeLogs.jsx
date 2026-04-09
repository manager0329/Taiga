import { useEffect, useState } from "react";
import {
  getMyTimeLogs,
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
} from "../services/timelogService";
import api from "../api/api";
import "./Styles/TimeLogs.css";

const TimeLogs = () => {
  const [logs, setLogs] = useState([]);
  const [issues, setIssues] = useState([]);
  const [view, setView] = useState("DAY");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    issueId: "",
    timeSpentHours: "",
    logDate: "",
  });

  // ================= LOAD LOGS =================
  const loadLogs = async () => {
    try {
      const data = await getMyTimeLogs();
      setLogs(data || []);
    } catch (err) {
      console.error("Failed to load timelogs", err);
    }
  };

  // ================= LOAD ISSUES =================
  const loadIssues = async () => {
    try {
      const res = await api.get("/issues");
      setIssues(res.data || []);
    } catch (err) {
      console.error("Failed to load issues", err);
    }
  };

  useEffect(() => {
    loadLogs();
    loadIssues();
  }, []);

  // ================= FILTER =================
  const filteredLogs = logs.filter((l) => {
    const d = new Date(l.logDate);
    const today = new Date();

    // DAY
    if (view === "DAY") {
      return d.toDateString() === today.toDateString();
    }

    // WEEK
    if (view === "WEEK") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      weekStart.setHours(0, 0, 0, 0);
      return d >= weekStart;
    }

    // MONTH
    if (view === "MONTH") {
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    }

    // YEAR
    if (view === "YEAR") {
      return d.getFullYear() === today.getFullYear();
    }

    return true;
  });

  // ================= TOTAL (UPDATED TO FILTERED) =================
  const totalTime = filteredLogs.reduce(
    (sum, l) => sum + Number(l.timeSpentHours || 0),
    0
  );

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      issueId: "",
      timeSpentHours: "",
      logDate: "",
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.issueId || !form.timeSpentHours || !form.logDate) {
      alert("All fields required");
      return;
    }

    try {
      if (editingId) {
        await updateTimeLog(editingId, {
          timeSpentHours: form.timeSpentHours,
          logDate: form.logDate,
        });
      } else {
        await createTimeLog(form.issueId, {
          timeSpentHours: form.timeSpentHours,
          logDate: form.logDate,
        });
      }

      resetForm();
      loadLogs();
    } catch (err) {
      console.error(err);
      alert("Failed to save timelog");
    }
  };

  return (
    <div className="timelogs-page">
      <h1>Time Logs</h1>

      <div className="summary">
        <span>
          Total Hours: <b>{totalTime}</b>
        </span>

        {/* ===== UPDATED VIEW TOGGLE ===== */}
        <div className="view-toggle">
          <button
            className={view === "DAY" ? "active" : ""}
            onClick={() => setView("DAY")}
          >
            Day
          </button>

          <button
            className={view === "WEEK" ? "active" : ""}
            onClick={() => setView("WEEK")}
          >
            Week
          </button>

          <button
            className={view === "MONTH" ? "active" : ""}
            onClick={() => setView("MONTH")}
          >
            Month
          </button>

          <button
            className={view === "YEAR" ? "active" : ""}
            onClick={() => setView("YEAR")}
          >
            Year
          </button>
        </div>
      </div>

      <div className="timelog-form">
        <select
          name="issueId"
          value={form.issueId}
          onChange={handleChange}
        >
          <option value="">Select Issue</option>
          {issues.map((issue) => (
            <option key={issue.id} value={issue.id}>
              #{issue.id} {issue.title ? `- ${issue.title}` : ""}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="timeSpentHours"
          placeholder="Hours"
          value={form.timeSpentHours}
          onChange={handleChange}
        />

        <input
          type="date"
          name="logDate"
          value={form.logDate}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {editingId ? "Update Log" : "Add Log"}
        </button>

        {editingId && (
          <button className="cancel" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <table className="timelog-table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Hours</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((l) => (
            <tr key={l.id}>
              <td>#{l.issue?.id}</td>
              <td>{l.timeSpentHours}</td>
              <td>{l.logDate}</td>
              <td>
                <button
                  onClick={() => {
                    setEditingId(l.id);
                    setForm({
                      issueId: l.issue.id,
                      timeSpentHours: l.timeSpentHours,
                      logDate: l.logDate,
                    });
                  }}
                >
                  Edit
                </button>

                <button
                  className="danger"
                  onClick={async () => {
                    await deleteTimeLog(l.id);
                    loadLogs();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredLogs.length === 0 && (
            <tr>
              <td colSpan="4" className="empty">
                No time logs yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TimeLogs;