import api from "./api";

// GET USERS
export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

// DELETE USER
export const deleteUser = async (id) => {
  await api.delete(`/admin/users/${id}`);
};

// UPDATE ROLE
export const updateUserRole = async (id, role) => {
  await api.put(`/admin/users/${id}/role`, null, {
    params: { role },
  });
};