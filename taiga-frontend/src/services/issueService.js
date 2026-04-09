import api from "../api/api";

// CREATE ISSUE
export const createIssue = async (data) => {
  const res = await api.post("/issues", data);
  return res.data;
};



// GET ISSUES BY PROJECT
export const getIssuesByProject = async (projectId) => {
  const res = await api.get(`/issues/project/${projectId}`);
  return res.data;
};

// UPDATE ISSUE
export const updateIssue = async (id, data) => {
  const res = await api.put(`/issues/${id}`, data);
  return res.data;
};

// UPDATE STATUS
export const updateIssueStatus = async (id, status) => {
  const res = await api.put(`/issues/${id}/status/${status}`);
  return res.data;
};

// DELETE ISSUE
export const deleteIssue = async (id) => {
  await api.delete(`/issues/${id}`);
};
