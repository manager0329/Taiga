import { useEffect, useState } from "react";
import {
  getMyProjects,
  createProject,
  updateProject,
  deleteProject
} from "../services/projectService";
import "./Styles/Project.css";

import {
  AddCircleOutline,
  FolderOpen,
  Description,
  Edit,
  Delete
} from "@mui/icons-material";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getMyProjects();
      setProjects(data || []);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    try {
      const newProject = await createProject({
        projectName,
        description
      });

      setProjects((prev) => [...prev, newProject]);
      setProjectName("");
      setDescription("");
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setProjectName(project.projectName);
    setDescription(project.description || "");
  };

  const handleUpdateProject = async () => {
    try {
      const updated = await updateProject(editingId, {
        projectName,
        description
      });

      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? updated : p))
      );

      setEditingId(null);
      setProjectName("");
      setDescription("");
    } catch (err) {
      console.error("Failed to update project", err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  return (
    <div className="projects-page premium-ui">

      {/* HEADER */}
      <div className="projects-header">
        <h1>Projects</h1>
        <p className="subtitle">Create and manage your workspaces</p>
      </div>

      {/* CREATE / EDIT PROJECT */}
      <div className="create-project-card glass-card">
        <h3>
          <AddCircleOutline />
          {editingId ? " Edit Project" : " Create New Project"}
        </h3>

        <div className="input-groups">
          <FolderOpen className="input-icon" />
          <input
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <Description className="input-icon" />
          <textarea
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {editingId ? (
          <div className="btn-update">
            <button className="primary-btn" onClick={handleUpdateProject}>
              Update
            </button>
            <button
              className="ghost-btn"
              onClick={() => {
                setEditingId(null);
                setProjectName("");
                setDescription("");
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="primary-btn" onClick={handleCreateProject}>
            Create Project
          </button>
        )}
      </div>

      {/* PROJECT LIST */}
      <div className="projects-section">
        <h3>Your Projects</h3>

        {loading ? (
          <div className="project-skeletons">
            {[1, 2, 3].map((i) => (
              <div key={i} className="project-skeleton" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="empty-text">No projects yet</p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <div className="project-card glass-card" key={project.id}>
                <div className="project-icon">
                  <FolderOpen />
                </div>

                <h4>{project.projectName}</h4>
                <p>{project.description || "No description"}</p>

                <div className="project-actions">
                  <Edit onClick={() => handleEdit(project)} />
                  <Delete onClick={() => handleDeleteProject(project.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;