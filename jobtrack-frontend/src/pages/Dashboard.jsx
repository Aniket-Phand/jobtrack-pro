import { useState, useEffect } from "react";
import {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
} from "../services/jobService";
import { toast } from "react-toastify";
import { useConfirm } from "../context/ConfirmContext";

function Dashboard() {
  const { openConfirm } = useConfirm();

  const [view, setView] = useState("HOME");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      setView("JOBS");
      setLoading(true);

      const data = await getJobs();
      const jobList = Array.isArray(data) ? data : data.content || [];

      setJobs(jobList);
      setFilteredJobs(jobList);
    } catch {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = (e) => {
    e.preventDefault();

    openConfirm(
      editId ? "Update Job" : "Create Job",
      editId
        ? "Are you sure you want to update this job?"
        : "Are you sure you want to create this job?",
      async () => {
        try {
          setBtnLoading(true);

          if (editId) {
            await updateJob(editId, { company, role, status });
            toast.success("Job updated 🎉");
          } else {
            await createJob({ company, role, status });
            toast.success("Job created 🚀");
          }

          resetForm();
          fetchJobs();
        } catch {
          toast.error("Operation failed");
        } finally {
          setBtnLoading(false);
        }
      }
    );
  };

  // ================= RESET =================
  const resetForm = () => {
    setCompany("");
    setRole("");
    setStatus("APPLIED");
    setEditId(null);
    setView("HOME");
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    openConfirm(
      "Delete Job",
      "Are you sure you want to delete this job?",
      async () => {
        try {
          await deleteJob(id);

          setJobs((prev) => prev.filter((j) => j.id !== id));
          setFilteredJobs((prev) =>
            prev.filter((j) => j.id !== id)
          );

          toast.success("Deleted 🗑️");
        } catch {
          toast.error("Delete failed");
        }
      }
    );
  };

  // ================= EDIT =================
  const handleEdit = (job) => {
    setEditId(job.id);
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
    setView("CREATE");
  };

  // ================= FILTER =================
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

  return (
    <div>

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        {["HOME", "JOBS", "CREATE"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              tab === "JOBS" ? fetchJobs() : setView(tab)
            }
            className={`px-4 py-2 rounded transition ${
              view === tab
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {tab === "HOME"
              ? "Home"
              : tab === "JOBS"
              ? "View Jobs"
              : "Create Job"}
          </button>
        ))}
      </div>

      {/* HOME */}
      {view === "HOME" && (
        <p className="text-gray-600 dark:text-gray-300">
          Manage your job applications efficiently 🚀
        </p>
      )}

      {/* CREATE */}
      {view === "CREATE" && (
        <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 
              bg-white text-gray-800 
              dark:bg-gray-800 dark:text-white dark:border-gray-600"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <input
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 
              bg-white text-gray-800 
              dark:bg-gray-800 dark:text-white dark:border-gray-600"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />

            <select
              className="w-full p-2 border rounded 
              bg-white text-gray-800 
              dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>APPLIED</option>
              <option>INTERVIEW</option>
              <option>OFFER</option>
              <option>REJECTED</option>
            </select>

            <button
              disabled={btnLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded"
            >
              {btnLoading
                ? "Processing..."
                : editId
                ? "Update Job"
                : "Create Job"}
            </button>

          </form>
        </div>
      )}

      {/* JOB LIST */}
      {view === "JOBS" && (
        <div>

          {/* FILTER */}
          <div className="flex gap-3 mb-4">
            <input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded 
              bg-white text-gray-800 
              dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded 
              bg-white text-gray-800 
              dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value="ALL">All</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* LIST */}
          {loading ? (
            <p>Loading...</p>
          ) : filteredJobs.length === 0 ? (
            <p>No jobs found</p>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:scale-[1.02] transition"
                >
                  <h3 className="font-bold">{job.role}</h3>
                  <p>{job.company}</p>
                  <p className="text-sm">{job.status}</p>

                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEdit(job)}
                      className="bg-yellow-400 px-2 py-1 rounded hover:scale-105 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(job.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:scale-105 transition"
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
    </div>
  );
}

export default Dashboard;