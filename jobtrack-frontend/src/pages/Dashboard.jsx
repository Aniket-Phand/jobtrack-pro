import { useState, useEffect } from "react";
import {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
} from "../services/jobService";
import { getUserFromToken } from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  // View state (HOME, JOBS, CREATE)
  const [view, setView] = useState("HOME");

  // Job data state
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [editId, setEditId] = useState(null);

  // Filter & search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const user = getUserFromToken();
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch jobs from backend
  const fetchJobs = async () => {
    setView("JOBS");
    setLoading(true);

    const data = await getJobs();
    const jobList = Array.isArray(data) ? data : data.content || [];

    setJobs(jobList);
    setFilteredJobs(jobList);
    setLoading(false);
  };

  // Handle create or update job
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateJob(editId, { company, role, status });
    } else {
      await createJob({ company, role, status });
    }

    resetForm();
    fetchJobs();
  };

  // Reset form fields
  const resetForm = () => {
    setCompany("");
    setRole("");
    setStatus("APPLIED");
    setEditId(null);
    setView("HOME");
  };

  // Delete job
  const handleDelete = async (id) => {
    await deleteJob(id);
    const updatedJobs = jobs.filter((j) => j.id !== id);
    setJobs(updatedJobs);
    setFilteredJobs(updatedJobs);
  };

  // Edit job
  const handleEdit = (job) => {
    setEditId(job.id);
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
    setView("CREATE");
  };

  // Apply search and filter
  useEffect(() => {
    let updated = [...jobs];

    // Filter by status
    if (filterStatus !== "ALL") {
      updated = updated.filter((job) => job.status === filterStatus);
    }

    // Search by company or role
    if (searchTerm) {
      updated = updated.filter(
        (job) =>
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(updated);
  }, [searchTerm, filterStatus, jobs]);

  // Get status color classes
  const getStatusColor = (status) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-100 text-blue-600";
      case "INTERVIEW":
        return "bg-yellow-100 text-yellow-600";
      case "OFFER":
        return "bg-green-100 text-green-600";
      case "REJECTED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">JobTrack</h2>

        <button
          onClick={() => setView("HOME")}
          className="mb-2 p-2 rounded hover:bg-gray-700 text-left"
        >
          Dashboard
        </button>

        <button
          onClick={fetchJobs}
          className="mb-2 p-2 rounded hover:bg-gray-700 text-left"
        >
          View Jobs
        </button>

        <button
          onClick={() => setView("CREATE")}
          className="p-2 rounded hover:bg-gray-700 text-left"
        >
          Create Job
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
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

        {/* Content */}
        <div className="p-6 overflow-auto">
          {/* HOME */}
          {view === "HOME" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Welcome</h2>
              <p className="text-gray-600">
                Manage your job applications efficiently.
              </p>
            </div>
          )}

          {/* JOB LIST */}
          {view === "JOBS" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Your Jobs</h2>

              {/* Search & Filter */}
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search by company or role"
                  className="p-2 border rounded w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                  className="p-2 border rounded"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="ALL">All</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : filteredJobs.length === 0 ? (
                <p>No jobs found</p>
              ) : (
                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white p-4 rounded-xl shadow"
                    >
                      <h3 className="font-semibold text-lg">
                        {job.role || "Job Role"}
                      </h3>

                      <p className="text-gray-600">{job.company}</p>

                      <span
                        className={`text-sm px-2 py-1 rounded ${getStatusColor(
                          job.status
                        )}`}
                      >
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
                  required
                />

                <input
                  className="w-full p-2 border rounded"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
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