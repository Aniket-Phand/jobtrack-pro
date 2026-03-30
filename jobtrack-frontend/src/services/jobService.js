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

//DELETE JOB
export const deleteJob = async (jobId) => {
  await api.delete(`/jobs/${jobId}`);
};

//UPDATE JOB
export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/jobs/${jobId}`, jobData);
  return response.data;
};