import { useState } from "react";
import {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
} from "../services/jobService";
import { getUserFromToken } from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [view, setView] = useState("HOME");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [editId, setEditId] = useState(null);

  const user = getUserFromToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchJobs = async () => {
    setView("JOBS");
    setLoading(true);

    const data = await getJobs();
    setJobs(Array.isArray(data) ? data : data.content || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateJob(editId, { company, role, status });
    } else {
      await createJob({ company, role, status });
    }

    setCompany("");
    setRole("");
    setStatus("APPLIED");
    setEditId(null);
    setView("HOME");
  };

  const handleDelete = async (id) => {
    await deleteJob(id);
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const handleEdit = (job) => {
    setEditId(job.id);
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
    setView("CREATE");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <div className="w-60 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">JobTrack 🚀</h2>

        <button
          onClick={() => setView("HOME")}
          className="mb-2 p-2 rounded hover:bg-gray-700 text-left"
        >
          🏠 Dashboard
        </button>

        <button
          onClick={fetchJobs}
          className="mb-2 p-2 rounded hover:bg-gray-700 text-left"
        >
          📄 View Jobs
        </button>

        <button
          onClick={() => setView("CREATE")}
          className="p-2 rounded hover:bg-gray-700 text-left"
        >
          ➕ Create Job
        </button>
      </div>

      {/*MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/*NAVBAR */}
        <div className="flex justify-between items-center bg-white p-4 shadow">
          <h1 className="font-semibold">Dashboard</h1>

          <div>
            <span className="mr-4 text-sm text-gray-600">
              {user?.email} ({user?.role})
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-auto">

          {/* HOME */}
          {view === "HOME" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Welcome 👋</h2>
              <p className="text-gray-600">
                Manage your job applications easily.
              </p>
            </div>
          )}

          {/* JOB LIST */}
          {view === "JOBS" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Your Jobs</h2>

              {loading ? (
                <p>Loading...</p>
              ) : jobs.length === 0 ? (
                <p>No jobs found</p>
              ) : (
                <div className="grid gap-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white p-4 rounded-xl shadow"
                    >
                      <h3 className="font-semibold text-lg">
                        {job.role || "Job Role"}
                      </h3>
                      <p className="text-gray-600">{job.company}</p>

                      <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-600">
                        {job.status}
                      </span>

                      <div className="mt-3 space-x-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="px-3 py-1 bg-yellow-400 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CREATE / EDIT */}
          {view === "CREATE" && (
            <div className="max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editId ? "Edit Job" : "Create Job"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />

                <input
                  className="w-full p-2 border rounded"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />

                <select
                  className="w-full p-2 border rounded"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>APPLIED</option>
                  <option>INTERVIEW</option>
                  <option>OFFER</option>
                  <option>REJECTED</option>
                </select>

                <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                  {editId ? "Update Job" : "Create Job"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;