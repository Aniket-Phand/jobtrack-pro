import { getUserFromToken } from "../services/api";

function AdminPage() {
  const user = getUserFromToken();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <p className="mt-2">
        Welcome Admin: {user?.email}
      </p>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <p>👥 User Management coming soon...</p>
      </div>
    </div>
  );
}

export default AdminPage;