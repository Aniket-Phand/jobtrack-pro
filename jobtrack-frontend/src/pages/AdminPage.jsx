import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../services/adminService";
import { toast, ToastContainer } from "react-toastify";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success("User deleted");
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">

      <ToastContainer />

      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Admin Panel 👑
      </h1>

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3">ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t dark:border-gray-700">
                  <td className="p-3">{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="border rounded p-1 dark:bg-gray-700"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPage;