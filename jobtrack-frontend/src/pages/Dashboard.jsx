import { useEffect, useState } from "react";
import { getJobs, createJob } from "../services/jobService";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  //FORM STATE
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("APPLIED");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getJobs();

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

  //HANDLE CREATE JOB
  const handleCreateJob = async (e) => {
    e.preventDefault();

    try {
      const newJob = {
        company,
        role,
        status,
      };

      await createJob(newJob);

      alert("Job Created ✅");

      //Refresh jobs
      fetchJobs();

      //Clear form
      setCompany("");
      setRole("");
      setStatus("APPLIED");

    } catch (error) {
      console.error("ERROR CREATING JOB:", error);
      alert("Failed to create job ❌");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Dashboard 🚀</h1>

      {/*CREATE JOB FORM */}
      <h2>➕ Add Job</h2>

      <form onSubmit={handleCreateJob} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="APPLIED">APPLIED</option>
          <option value="INTERVIEW">INTERVIEW</option>
          <option value="OFFER">OFFER</option>
          <option value="REJECTED">REJECTED</option>
        </select>

        <button type="submit" style={{ marginLeft: "10px" }}>
          Add Job
        </button>
      </form>

      <hr />

      {/*JOB LIST */}
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
                <strong>Company:</strong> {job.company}
              </p>

              <p>
                <strong>Status:</strong> {job.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;