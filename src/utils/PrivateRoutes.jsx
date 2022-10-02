import react from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../context/authContext";
import { Outlet } from "react-router";
import Login from "../pages/Login";

const PrivateRoutes = () => {
  const user = useAuthState();
  const navigate = useNavigate();

  return user.isAuthenticated ? <Outlet /> : <Login />;
};

export default PrivateRoutes;
