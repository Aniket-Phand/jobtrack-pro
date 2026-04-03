import api from "./api";

// Fetch all jobs
export const getJobs = async () => {
  const response = await api.get("/jobs");
  return response.data;
};

// Create a new job
export const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);
  return response.data;
};

// Delete a job by ID
export const deleteJob = async (jobId) => {
  await api.delete(`/jobs/${jobId}`);
};

// Update job by ID
export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/jobs/${jobId}`, jobData);
  return response.data;
};