import api from "../api/api";

export const getStats = async () => {
  try {
    const [projects, sprints, tasks, issues, timelogs] = await Promise.all([
      api.get("/projects"),
      api.get("/sprints/my"),     // ✅ FIXED
      api.get("/tasks"),
      api.get("/issues"),
      api.get("/timelogs")     // ✅ FIXED
    ]);

    const totalHours = timelogs.data.reduce(
      (sum, log) => sum + Number(log.timeSpentHours || 0), 0);

    return {
      projects: projects.data.length,
      sprints: sprints.data.length,
      tasks: tasks.data.length,
      issues: issues.data.length,
      timelogs: totalHours
    };
  } catch (err) {
    console.error("Dashboard load failed", err);
    return {
      projects: 0,
      sprints: 0,
      tasks: 0,
      issues: 0,
      timelogs: 0
    };
  }
};
