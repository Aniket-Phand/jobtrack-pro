import { Navigate } from "react-router-dom";

//COMMON TOKEN CHECK
const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

function ProtectedRoute({ children }) {
  const token = getToken();

  //No token → redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  //Token exists → allow access
  return children;
}

export default ProtectedRoute;