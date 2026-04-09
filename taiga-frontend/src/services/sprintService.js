import api from "../api/api";

export const getSprints = async () => {
  const res = await api.get("/sprints/my");
  return res.data;
};

export const createSprint = async (projectId, sprintData) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }

  const res = await api.post(`/sprints/project/${projectId}`, sprintData);
  return res.data;
};

export const updateSprint = async (id, data) => {
  const res = await api.put(`/sprints/${id}`, data);
  return res.data;
};

export const deleteSprint = async (id) => {
  await api.delete(`/sprints/${id}`);
};