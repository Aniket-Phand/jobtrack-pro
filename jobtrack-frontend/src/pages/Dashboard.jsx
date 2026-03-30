import { useEffect, useState } from "react";
import {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
} from "../services/jobService";
import { getUserFromToken } from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [view, setView] = useState("HOME"); // HOME | JOBS | CREATE
  const [loading, setLoading] = useState(false);
  const [editJobId, setEditJobId] = useState(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("APPLIED");

  const user = getUserFromToken();
  const navigate = useNavigate();

  //FETCH JOBS ONLY WHEN CLICKED
  const handleFetchJobs = async () => {
    setView("JOBS");
    setLoading(true);

    try {
      const response = await getJobs();

      if (Array.isArray(response)) setJobs(response);
      else if (Array.isArray(response.content)) setJobs(response.content);
      else setJobs([]);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  //CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editJobId) {
        await updateJob(editJobId, { company, role, status });
        alert("Updated ✅");
      } else {
        await createJob({ company, role, status });
        alert("Created ✅");
      }

      resetForm();
      setView("HOME");
    } catch {
      alert("Error ❌");
    }
  };

  const handleDelete = async (id) => {
    await deleteJob(id);
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const handleEdit = (job) => {
    setEditJobId(job.id);
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
    setView("CREATE");
  };

  const resetForm = () => {
    setCompany("");
    setRole("");
    setStatus("APPLIED");
    setEditJobId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#eef2f7" }}>
      
      {/*NAVBAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 30px",
        background: "#1e293b",
        color: "white"
      }}>
        <h2>JobTrack Pro 🚀</h2>

        <div>
          <span style={{ marginRight: "15px" }}>
            {user?.email} ({user?.role})
          </span>

          <button onClick={handleLogout} style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px"
          }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>

        {/*HOME VIEW */}
        {view === "HOME" && (
          <div style={{ textAlign: "center" }}>
            <h1>Welcome 👋</h1>
            <p>Manage your job applications efficiently</p>

            <div style={{ marginTop: "30px" }}>
              <button
                onClick={handleFetchJobs}
                style={btnStyle("#3b82f6")}
              >
                📄 View Jobs
              </button>

              <button
                onClick={() => setView("CREATE")}
                style={btnStyle("#10b981")}
              >
                ➕ Create Job
              </button>
            </div>
          </div>
        )}

        {/*JOB LIST VIEW */}
        {view === "JOBS" && (
          <div>
            <button onClick={() => setView("HOME")}>⬅ Back</button>

            <h2>Your Jobs</h2>

            {loading ? (
              <p>Loading...</p>
            ) : jobs.length === 0 ? (
              <p>No jobs found</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} style={cardStyle}>
                  <h3>{job.role}</h3>
                  <p>{job.company}</p>
                  <p>Status: {job.status}</p>

                  <button onClick={() => handleEdit(job)}>Edit</button>
                  <button onClick={() => handleDelete(job.id)}>Delete</button>
                </div>
              ))
            )}
          </div>
        )}

        {/*CREATE / EDIT VIEW */}
        {view === "CREATE" && (
          <div>
            <button onClick={() => setView("HOME")}>⬅ Back</button>

            <h2>{editJobId ? "Edit Job" : "Create Job"}</h2>

            <form onSubmit={handleSubmit} style={formStyle}>
              <input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />

              <input
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />

              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>APPLIED</option>
                <option>INTERVIEW</option>
                <option>OFFER</option>
                <option>REJECTED</option>
              </select>

              <button type="submit">
                {editJobId ? "Update" : "Create"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

//STYLES
const btnStyle = (color) => ({
  margin: "10px",
  padding: "12px 20px",
  background: color,
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px"
});

const cardStyle = {
  background: "white",
  padding: "15px",
  marginTop: "10px",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxWidth: "400px"
};

export default Dashboard;