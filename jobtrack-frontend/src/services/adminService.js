import api from "./api";

// GET USERS
export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

// DELETE USER
export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

// UPDATE ROLE
export const updateUserRole = async (id, role) => {
  const res = await api.put(`/admin/users/${id}/role?role=${role}`);
  return res.data;
};