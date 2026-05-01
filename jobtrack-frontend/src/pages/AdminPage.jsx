import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../services/adminService";
import { toast } from "react-toastify";
import { getUserFromToken } from "../services/api";
import { useConfirm } from "../context/ConfirmContext";

function AdminPage() {
  const { openConfirm } = useConfirm();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState({});

  const currentUser = getUserFromToken();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);

      const roleMap = {};
      data.forEach((u) => (roleMap[u.id] = u.role));
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

  const handleDelete = (id, email) => {
    if (email === currentUser?.email) {
      toast.error("You cannot delete yourself");
      return;
    }

    openConfirm(
      "Delete User",
      "Are you sure? All jobs will also be deleted.",
      async () => {
        try {
          setLoadingId(id);
          await deleteUser(id);
          toast.success("User deleted");
          fetchUsers();
        } catch {
          toast.error("Delete failed");
        } finally {
          setLoadingId(null);
        }
      }
    );
  };

  const handleRoleUpdate = (id) => {
    const newRole = selectedRoles[id];

    openConfirm(
      "Update Role",
      "Are you sure you want to change role?",
      async () => {
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
      }
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white dark:bg-gray-800 rounded shadow">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>

                <td>
                  <select
                    value={selectedRoles[user.id]}
                    onChange={(e) =>
                      setSelectedRoles({
                        ...selectedRoles,
                        [user.id]: e.target.value,
                      })
                    }
                  >
                    <option>USER</option>
                    <option>ADMIN</option>
                  </select>

                  <button
                    onClick={() => handleRoleUpdate(user.id)}
                    className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Update
                  </button>
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleDelete(user.id, user.email)
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;