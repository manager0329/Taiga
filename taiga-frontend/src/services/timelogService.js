import api from "../api/api";

export const getMyTimeLogs = async () => {
  const res = await api.get("/timelogs");
  return res.data;
};

export const createTimeLog = async (issueId, data) => {
  const res = await api.post(`/timelogs/issue/${issueId}`, data);
  return res.data;
};

export const updateTimeLog = async (id, data) => {
  const res = await api.put(`/timelogs/${id}`, data);
  return res.data;
};

export const deleteTimeLog = async (id) => {
  await api.delete(`/timelogs/${id}`);
};