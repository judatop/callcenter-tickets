import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import CustomNavbar from "./components/CustomNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuthState } from "./context/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { routes } from "./utils/routes.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import NewTicket from "./pages/NewTicket.jsx";
import Tickets from "./pages/Tickets.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
  const user = useAuthState();

  return (
    <AuthProvider>
      <ToastContainer />
      <CustomNavbar />

      <Routes>
        <Route element={<PrivateRoutes />}>
          {/* {routes.map((route) => (
            <Route
              key={route.path}
              element={route.element}
              path={route.path}
              exact
            />
          ))} */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/newticket" element={<NewTicket />} />
          <Route path="/tickets" element={<Tickets />} />
        </Route>
        <Route element={<Login />} path="/login" />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </AuthProvider>
  );
};

export default App;
