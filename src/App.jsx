import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import CustomNavbar from "./components/CustomNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/authContext";
import { SocketProvider } from "./context/SocketProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import NewTicket from "./pages/NewTicket.jsx";
import Tickets from "./pages/Tickets.jsx";
import NotFound from "./pages/NotFound.jsx";
import Report from "./pages/Report.jsx";

import {
  DEFAULT_URL,
  LOGIN_URL,
  HOME_URL,
  NEW_TICKET_URL,
  TICKETS_URL,
  REPORT_URL,
  TICKET_DETAIL_URL
} from "./helpers/urls.js";
import TicketDetail from "./pages/TicketDetail.jsx";

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastContainer />
        <CustomNavbar />

        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path={DEFAULT_URL} element={<Home />} />
            <Route path={HOME_URL} element={<Home />} />
            <Route path={NEW_TICKET_URL} element={<NewTicket />} />
            <Route path={TICKETS_URL} element={<Tickets />} />
            <Route path={REPORT_URL} element={<Report />} />
            <Route path={TICKET_DETAIL_URL} element={<TicketDetail />} />
          </Route>
          <Route path={LOGIN_URL} element={<Login />} />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
