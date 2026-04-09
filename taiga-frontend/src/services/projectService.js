import api from "../api/api";

export const getMyProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const createProject = async (project) => {
  const res = await api.post("/projects", project);
  return res.data;
};

export const updateProject = async (id, project) => {
  const res = await api.put(`/projects/${id}`, project);
  return res.data;
};

export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};