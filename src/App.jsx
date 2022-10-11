import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import CustomNavbar from "./components/CustomNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import NewTicket from "./pages/NewTicket.jsx";
import Tickets from "./pages/Tickets.jsx";
import NotFound from "./pages/NotFound.jsx";
import { SocketContext, socket } from "./context/socketContext.jsx";
import {DEFAULT_URL, LOGIN_URL, HOME_URL, NEW_TICKET_URL, TICKETS_URL} from "./helpers/urls.js";

const App = () => {

  return (
    <AuthProvider>
      <SocketContext.Provider value={socket}>
        <ToastContainer />
        <CustomNavbar />

        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path={DEFAULT_URL} element={<Home />} />
            <Route path={HOME_URL} element={<Home />} />
            <Route path={NEW_TICKET_URL} element={<NewTicket />} />
            <Route path={TICKETS_URL} element={<Tickets />} />
          </Route>
          <Route  path={LOGIN_URL} element={<Login />} />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </SocketContext.Provider>
    </AuthProvider>
  );
};

export default App;
