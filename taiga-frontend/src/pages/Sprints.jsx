import { useEffect, useState } from "react";
import {
  getSprints,
  createSprint,
  updateSprint,
  deleteSprint,
} from "../services/sprintService";
import { getMyProjects } from "../services/projectService";
import "./Styles/Sprints.css";

import { Edit, Delete, Add, Close } from "@mui/icons-material";

const Sprints = () => {
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [sprintName, setSprintName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);

  // LOAD DATA
  const loadData = async () => {
    try {
      const [sprintData, projectData] = await Promise.all([
        getSprints(),
        getMyProjects(),
      ]);

      setSprints(sprintData || []);
      setProjects(projectData || []);
    } catch (error) {
      console.error("Failed to load sprint data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setSprintName("");
    setProjectId("");
    setStartDate("");
    setEndDate("");
    setEditingId(null);
    setShowModal(false);
  };

  // CREATE / UPDATE
  const handleSubmit = async () => {
    if (!sprintName || !projectId || !startDate || !endDate) {
      alert("All fields are required");
      return;
    }

    const payload = { sprintName, startDate, endDate };

    try {
      if (editingId) {
        await updateSprint(editingId, payload);
      } else {
        await createSprint(projectId, payload);
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error("Failed to save sprint", err);
      alert("Failed to save sprint");
    }
  };

  // EDIT
  const handleEdit = (s) => {
    setEditingId(s.id);
    setSprintName(s.sprintName);
    setProjectId(s.project?.id || "");
    setStartDate(s.startDate);
    setEndDate(s.endDate);
    setShowModal(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sprint?")) return;

    try {
      await deleteSprint(id);
      loadData();
    } catch (err) {
      console.error("Failed to delete sprint", err);
      alert("Failed to delete sprint");
    }
  };

  return (
    <div className="sprints-page">

      {/* HEADER */}
      <div className="sprint-header">
        <h1>Sprints</h1>
        <button className="create-btn" onClick={() => setShowModal(true)}>
          <Add /> Create Sprint
        </button>
      </div>

      {/* SPRINT CARDS */}
      {loading ? (
        <p className="loading">Loading sprints...</p>
      ) : sprints.length === 0 ? (
        <p className="empty">No sprints created yet</p>
      ) : (
        <div className="sprint-grid">
          {sprints.map((s) => (
            <div key={s.id} className="sprint-card">
              <h3>{s.sprintName}</h3>
              <p className="project">Project: {s.project?.projectName}</p>
              <p className="date">{s.startDate} → {s.endDate}</p>

              <div className="card-actions">
                <button className="icon-btn edit" onClick={() => handleEdit(s)}>
                  <Edit fontSize="small" />
                </button>

                <button className="icon-btn delete" onClick={() => handleDelete(s.id)}>
                  <Delete fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>

          <div className="modal-card" onClick={(e) => e.stopPropagation()}>

            <button className="modal-close" onClick={() => setShowModal(false)}>
              <Close />
            </button>

            <h2>{editingId ? "Update Sprint" : "Create Sprint"}</h2>

            <input
              type="text"
              placeholder="Sprint name"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
            />

            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              disabled={editingId !== null}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName}
                </option>
              ))}
            </select>

            <div className="date-row">
              <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
              <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
            </div>

            <button className="submit-btn" onClick={handleSubmit}>
              {editingId ? "Update Sprint" : "Create Sprint"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Sprints;