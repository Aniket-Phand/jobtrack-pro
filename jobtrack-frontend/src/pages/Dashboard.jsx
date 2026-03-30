import { useEffect } from "react";
import { getJobs } from "../services/jobService";

function Dashboard() {

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      console.log("JOBS DATA:", data);
    } catch (error) {
      console.error("ERROR FETCHING JOBS:", error);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>Dashboard 🚀</h1>
      <p>Welcome to JobTrack Pro</p>
    </div>
  );
}

export default Dashboard;