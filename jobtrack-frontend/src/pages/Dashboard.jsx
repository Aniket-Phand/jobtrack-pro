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
  // View state
  const [view, setView] = useState("HOME");

  // Job state
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [editId, setEditId] = useState(null);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Dark mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);

  const user = getUserFromToken();
  const navigate = useNavigate();

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch jobs
  const fetchJobs = async () => {
    setView("JOBS");
    setLoading(true);

    const data = await getJobs();
    const jobList = Array.isArray(data) ? data : data.content || [];

    setJobs(jobList);
    setFilteredJobs(jobList);
    setLoading(false);
  };

  // Submit form
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

  // Reset form
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
    const updated = jobs.filter((j) => j.id !== id);
    setJobs(updated);
    setFilteredJobs(updated);
  };

  // Edit job
  const handleEdit = (job) => {
    setEditId(job.id);
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
    setView("CREATE");
  };

  // Filter logic
  useEffect(() => {
    let updated = [...jobs];

    if (filterStatus !== "ALL") {
      updated = updated.filter((j) => j.status === filterStatus);
    }

    if (searchTerm) {
      updated = updated.filter(
        (j) =>
          j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(updated);
  }, [searchTerm, filterStatus, jobs]);

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
      case "INTERVIEW":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300";
      case "OFFER":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-60 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">JobTrack</h2>

        <button onClick={() => setView("HOME")} className="mb-2 p-2 hover:bg-gray-700 text-left">
          Dashboard
        </button>

        <button onClick={fetchJobs} className="mb-2 p-2 hover:bg-gray-700 text-left">
          View Jobs
        </button>

        <button onClick={() => setView("CREATE")} className="p-2 hover:bg-gray-700 text-left">
          Create Job
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow">
          <h1 className="font-semibold text-gray-800 dark:text-white">Dashboard</h1>

          <div className="flex items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="mr-4 px-3 py-1 border rounded dark:text-white"
            >
              {darkMode ? "Light" : "Dark"}
            </button>

            <span className="mr-4 text-sm text-gray-600 dark:text-gray-300">
              {user?.email} ({user?.role})
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto text-gray-800 dark:text-white">
          {view === "HOME" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Welcome</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your job applications efficiently.
              </p>
            </div>
          )}

          {view === "JOBS" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Your Jobs</h2>

              {/* Search + Filter */}
              <div className="flex gap-4 mb-4">
                <input
                  className="p-2 border rounded w-full dark:bg-gray-800"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                  className="p-2 border rounded dark:bg-gray-800"
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
                <div className="flex justify-center items-center h-40">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredJobs.length === 0 ? (
                <p>No jobs found</p>
              ) : (
                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition"
                    >
                      <h3 className="font-semibold text-lg">{job.role}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{job.company}</p>

                      <span className={`text-sm px-2 py-1 rounded ${getStatusColor(job.status)}`}>
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
                          onClick={() => setDeleteId(job.id)}
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

          {view === "CREATE" && (
            <div className="max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editId ? "Edit Job" : "Create Job"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full p-2 border rounded dark:bg-gray-800"
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />

                <input
                  className="w-full p-2 border rounded dark:bg-gray-800"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />

                <select
                  className="w-full p-2 border rounded dark:bg-gray-800"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>APPLIED</option>
                  <option>INTERVIEW</option>
                  <option>OFFER</option>
                  <option>REJECTED</option>
                </select>

                <button className="w-full bg-blue-500 text-white p-2 rounded">
                  {editId ? "Update Job" : "Create Job"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>

            <p className="text-sm mb-4">
              Are you sure you want to delete this job?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleDelete(deleteId);
                  setDeleteId(null);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;