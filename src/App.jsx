import { useState } from "react";
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

const App = () => {
  const [userLogged, setUserLogged] = useState(true);

  return (
    <BrowserRouter>
      {userLogged ? (
        <div>
          <div>
            <CustomNavbar />
          </div>
          <Routes>
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
      ) : (
        <Login />
      )}
    </BrowserRouter>
  );
};

export default App;
