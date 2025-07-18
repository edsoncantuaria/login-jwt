import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
