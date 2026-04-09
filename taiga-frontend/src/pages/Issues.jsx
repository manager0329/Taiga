import { useEffect, useState } from "react";
import api from "../api/api";
import "./Styles/Issues.css";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  // const [users, setUsers] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "MEDIUM",
    projectId: "",
    sprintId: "",
    status: "OPEN",
  });

  // ===============================
  // LOAD DATA
  // ===============================
  

  const loadAll = async () => {
    const [issueRes, projectRes, sprintRes] = await Promise.all([
      api.get("/issues"),
      api.get("/projects"),
      api.get("/sprints/my"),
      api.get("/users"),
    ]);

    setIssues(issueRes.data || []);
    setProjects(projectRes.data || []);
    setSprints(sprintRes.data || []);
    // setUsers(userRes.data || []);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ===============================
  // HANDLE FORM
  // ===============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      subject: "",
      description: "",
      priority: "MEDIUM",
      projectId: "",
      sprintId: "",
      assignedToId: "",
      status: "OPEN",
    });
  };

  // ===============================
  // CREATE / UPDATE
  // ===============================
  const handleSubmit = async () => {
    if (!form.subject || !form.projectId) {
      alert("Subject and Project are required");
      return;
    }

    const payload = {
      subject: form.subject,
      description: form.description,
      priority: form.priority,
      project: { id: form.projectId },
      sprint: form.sprintId ? { id: form.sprintId } : null,
      assignedTo: form.assignedToId ? { id: form.assignedToId } : null,
      status: form.status,
    };

    try {
      if (editingId) {
        await api.put(`/issues/${editingId}`, payload);
        alert("Issue updated successfully");
      } else {
        // ❗ DO NOT SEND STATUS ON CREATE
        const { status, ...createPayload } = payload;
        await api.post("/issues", createPayload);
        alert("Issue created successfully");
      }

      resetForm();
      loadAll();
    } catch (err) {
      console.error(err);
      alert("Failed to save issue");
    }
  };

  // ===============================
  // EDIT
  // ===============================
  const handleEdit = (issue) => {
    setEditingId(issue.id);
    setForm({
      subject: issue.subject,
      description: issue.description || "",
      priority: issue.priority,
      projectId: issue.project?.id || "",
      sprintId: issue.sprint?.id || "",
      assignedToId: issue.assignedTo?.id || "",
      status: issue.status,
    });
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this issue?")) return;

    await api.delete(`/issues/${id}`);
    alert("Issue deleted successfully");
    loadAll();
  };

  // ===============================
  // STATUS CHANGE
  // ===============================
  const updateStatus = async (id, status) => {
    await api.put(`/issues/${id}/status/${status}`);
    loadAll();
  };

  return (
    <div className="issues-page">
      <h1>Issues</h1>

      {/* ================= CREATE / UPDATE FORM ================= */}
      <div className="issue-form">
        <input
          name="subject"
          placeholder="Issue subject"
          value={form.subject}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <select name="priority" value={form.priority} onChange={handleChange}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          name="projectId"
          value={form.projectId}
          onChange={handleChange}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.projectName}
            </option>
          ))}
        </select>

        <select
          name="sprintId"
          value={form.sprintId}
          onChange={handleChange}
        >
          <option value="">Select Sprint</option>
          {sprints.map((s) => (
            <option key={s.id} value={s.id}>
              {s.sprintName}
            </option>
          ))}
        </select>

        

        {editingId && (
          <select name="status" value={form.status} onChange={handleChange}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}

        <button onClick={handleSubmit}>
          {editingId ? "Update Issue" : "Create Issue"}
        </button>

        {editingId && (
          <button className="cancel" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      {/* ================= ISSUE LIST ================= */}
      <div className="issue-grid">
        {issues.map((i) => (
          <div key={i.id} className="issue-card">
            <h3>{i.subject}</h3>
            <p>{i.description}</p>

            <div className="badges">
              <span className={`priority ${i.priority}`}>
                {i.priority}
              </span>
              <span className={`status ${i.status}`}>
                {i.status}
              </span>
            </div>

            <p className="meta">
              Project: {i.project?.projectName || "-"}
            </p>

            <div className="actions">
              <select
                value={i.status}
                onChange={(e) => updateStatus(i.id, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button onClick={() => handleEdit(i)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(i.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Issues;
