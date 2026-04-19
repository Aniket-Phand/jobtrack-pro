import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../services/adminService";
import { toast, ToastContainer } from "react-toastify";
import { getUserFromToken } from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState({});

  const currentUser = getUserFromToken();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);

      const roleMap = {};
      data.forEach((u) => {
        roleMap[u.id] = u.role;
      });
      setSelectedRoles(roleMap);

    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = async () => {
    try {
      setLoadingId(deleteUserId);
      await deleteUser(deleteUserId);

      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoadingId(null);
      setDeleteUserId(null);
    }
  };

  const handleRoleUpdate = async (id) => {
    const newRole = selectedRoles[id];

    if (!window.confirm("Are you sure you want to change this user's role?")) {
      return;
    }

    try {
      setLoadingId(id);
      await updateUserRole(id, newRole);

      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">

      <ToastContainer />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Panel
        </h1>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>

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

                  {/* ROLE */}
                  <td>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedRoles[user.id]}
                        onChange={(e) =>
                          setSelectedRoles({
                            ...selectedRoles,
                            [user.id]: e.target.value,
                          })
                        }
                        className="border rounded p-1 dark:bg-gray-700"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>

                      <button
                        onClick={() => handleRoleUpdate(user.id)}
                        disabled={loadingId === user.id}
                        className="bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
                      >
                        {loadingId === user.id ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </td>

                  {/* DELETE */}
                  <td>
                    <button
                      onClick={() => {
                        if (user.email === currentUser?.email) {
                          toast.error("You cannot delete yourself");
                          return;
                        }
                        setDeleteUserId(user.id);
                      }}
                      disabled={loadingId === user.id}
                      className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
                    >
                      {loadingId === user.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">

            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>

            <p className="mb-4">
              Are you sure you want to delete this user?
              <br />
              <span className="text-red-500">
                All jobs of this user will also be deleted.
              </span>
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
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

export default AdminPage;