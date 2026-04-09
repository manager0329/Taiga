import api from "../api/api";

export const getTasksBySprint = async (sprintId) => {
  const res = await api.get(`/tasks/sprint/${sprintId}`);
  return res.data;
};

export const getMyTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

export const createTask = async (sprintId, title) => {
  const res = await api.post(`/tasks/sprint/${sprintId}`, { title });
  return res.data;
};

export const updateTask = async (taskId, updatedFields) => {
  const res = await api.put(`/tasks/${taskId}`, updatedFields);
  return res.data;
};

export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
};