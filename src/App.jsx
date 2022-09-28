import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HOME_ENDPOINT,
  LOGIN_ENDPOINT,
  NEW_TICKET_ENDPOINT,
  TICKETS_ENDPOINT,
} from "./helpers/endpoints";
import Login from "./pages/Login";
import { Container } from "react-bootstrap";
import CustomNavbar from "./components/CustomNavbar";
import Home from "./pages/Home";
import NewTicket from "./pages/NewTicket";
import Tickets from "./pages/Tickets";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuthState } from "./context/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const user = useAuthState();

  return (
    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <div>
          <div>
            <CustomNavbar />
          </div>
          <Routes>
            <Route exact path="/" element={<Home />}></Route>

            <Route exact path={HOME_ENDPOINT} element={<Home />}></Route>

            <Route exact path={LOGIN_ENDPOINT} element={<Login />}></Route>

            <Route
              exact
              path={NEW_TICKET_ENDPOINT}
              element={<NewTicket />}
            ></Route>

            <Route exact path={TICKETS_ENDPOINT} element={<Tickets />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
