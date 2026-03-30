import api from "./api";

//GET ALL JOBS
export const getJobs = async () => {
  const response = await api.get("/jobs");
  return response.data;
};

//CREATE JOB
export const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);
  return response.data;
};