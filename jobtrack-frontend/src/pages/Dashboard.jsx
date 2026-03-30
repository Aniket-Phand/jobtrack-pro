import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      console.log("FULL RESPONSE:", response);

      if (Array.isArray(response)) {
        setJobs(response);
      } else if (Array.isArray(response.content)) {
        setJobs(response.content);
      } else if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        setJobs([]);
      }

    } catch (error) {
      console.error("ERROR FETCHING JOBS:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Dashboard 🚀</h1>
      <p>Welcome to JobTrack Pro</p>

      <hr />

      <h2>📋 Your Jobs</h2>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found ❌</p>
      ) : (
        <div>
          {jobs.map((job, index) => (
            <div
              key={job.id || index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{job.role || `Job ${index + 1}`}</h3>

              <p>
                <strong>Company:</strong> {job.company || "Not specified"}
              </p>

              <p>
                <strong>Status:</strong> {job.status || "Unknown"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;