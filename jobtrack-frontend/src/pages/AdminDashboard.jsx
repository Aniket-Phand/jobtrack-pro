import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dashboard");
      setData(res.data);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  const chartData = [
    { name: "Applied", value: data.applied },
    { name: "Interview", value: data.interview },
    { name: "Offer", value: data.offer },
    { name: "Rejected", value: data.rejected },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Dashboard
        </h1>

        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Back to Admin Panel
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white dark:bg-gray-800 p-5 rounded shadow">
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-2xl font-bold">{data.totalUsers}</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded shadow">
          <p className="text-gray-500">Total Jobs</p>
          <h2 className="text-2xl font-bold">{data.totalJobs}</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded shadow">
          <p className="text-gray-500">Interviews</p>
          <h2 className="text-2xl font-bold">{data.interview}</h2>
        </div>

      </div>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

        <div className="bg-blue-500 text-white p-4 rounded">
          Applied: {data.applied}
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded">
          Interview: {data.interview}
        </div>

        <div className="bg-green-500 text-white p-4 rounded">
          Offer: {data.offer}
        </div>

        <div className="bg-red-500 text-white p-4 rounded">
          Rejected: {data.rejected}
        </div>

      </div>

      {/* CHART */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">

        <h2 className="text-lg font-semibold mb-4">
          Job Status Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default AdminDashboard;