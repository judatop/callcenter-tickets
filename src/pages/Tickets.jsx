import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  ListGroup,
  Button,
  Form,
  InputGroup,
  ListGroupItem,
  Table,
} from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";
import { getOrders } from "../services/OrderService.jsx";
import { useAuthState } from "../context/authContext.jsx";
import axios from "axios";
import {
  GET_ORDERS_ENDPOINT,
  GET_STATES_ENDPOINT,
  GET_OFFICES_ENDPOINT,
  CHANGE_STATE_ORDER_ENDPOINT,
} from "../helpers/endpoints.js";
import io from "socket.io-client";
import { API_ENDPOINT } from "../helpers/endpoints";
import { BsFillPersonFill } from "react-icons/bs";
import { HiIdentification } from "react-icons/hi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { colorCbvision } from "../helpers/helpers.js";
import cardHover from "../styles/cardHover.css";
import jumbotron from "../styles/jumbotron.css";
import tableRow from "../styles/tableRow.css";
import { GET_DETAILS_ORDER_ENDPOINT } from "../helpers/endpoints.js";
import moment from "moment";
import validator from "validator";
import { toast } from "react-toastify";
import { GoLocation } from "react-icons/go";
const socket = io(API_ENDPOINT);

const Tickets = () => {
  const [showOrders, setShowOrders] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderSelected, setOrderSelected] = useState(null);
  const [showOrderSelected, setShowOrderSelected] = useState(false);
  const user = useAuthState();
  const [states, setStates] = useState([]);
  const [offices, setOffices] = useState([]);
  const [observation, setObservation] = useState("");
  const [errors, setErrors] = useState({});
  const [observations, setObservations] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const getStates = async () => {
      try {
        const response = await axios.get(GET_STATES_ENDPOINT, {
          headers: { Authorization: user.token },
        });
        setStates(response.data.states);
      } catch (errorsAxios) {
        console.log(errorsAxios);
      }
    };

    const getOffices = async () => {
      try {
        const response = await axios.get(GET_OFFICES_ENDPOINT, {
          headers: { Authorization: user.token },
        });
        setOffices(response.data.offices);
      } catch (errorsAxios) {
        console.log(errorsAxios);
      }
    };

    getStates();
    getOffices();
    getOrders();

    socket.emit("join", {
      office_id: user.office,
      roles: user.roles,
    });

    socket.on("new_message", (data) => {
      const orderId = data.order_id;
      newObservation(orderId, data.username);
    });

    socket.on("new_order", (data) => {
      getOrders();
    });

    socket.on("new_state", (data) => {
      getOrders();
      setOrderSelected(null);
    });
  }, []);

  const getOrders = async () => {
    try {
      const response = await axios.get(GET_ORDERS_ENDPOINT, {
        headers: { Authorization: user.token },
      });
      setOrders(response.data.orders);
    } catch (errorsAxios) {
      console.log(errorsAxios);
      if (errorsAxios) {
        errorsAxios.response.data.forEach((error) => {
          toast.error(error.msg, {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      }
    }
  };

  const newObservation = async (idOrder, username) => {
    try {
      const response = await axios.get(GET_ORDERS_ENDPOINT, {
        headers: { Authorization: user.token },
      });
      const orders = response.data.orders;

      const orderSelected = orders.filter((order) => order.id === idOrder)[0];

      const response2 = await axios.get(
        GET_DETAILS_ORDER_ENDPOINT + "/" + idOrder,
        {
          headers: { Authorization: user.token },
        }
      );
      // Obtenemos observaciones de la orden seleccionada
      setOrders(orders);
      setObservations(response2.data.Detalles);
      setOrderSelected(orderSelected);

      if (user.username !== username) {
        toast.success("Nueva observacion de Orden N° " + idOrder, {
          position: "top-right",
          autoClose: false,
          newestOnTop: false,
          closeOnClick: false,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
        });
      }
    } catch (errorsAxios) {
      console.log(errorsAxios);
    }
  };

  const selectTicket = async (idOrder) => {
    const orderSelected = orders.filter((order) => order.id === idOrder)[0];
    getObservationsByOrder(idOrder);
    setOrderSelected(orderSelected);
    setShowOrders(false);
    setShowOrderSelected(true);
  };

  const getObservationsByOrder = async (idOrder) => {
    try {
      const response = await axios.get(
        GET_DETAILS_ORDER_ENDPOINT + "/" + idOrder,
        {
          headers: { Authorization: user.token },
        }
      );
      setObservations(response.data.Detalles);
    } catch (errorsAxios) {
      console.log(errorsAxios);
    }
  };

  const sendObservation = (event, observation, orderSelected) => {
    event.preventDefault();

    if (!validator.isEmpty(observation)) {
      const data = {
        office_id: orderSelected.office_id,
        description: observation,
        order_id: orderSelected.id,
        username: user.username,
      };

      socket.emit("new_message", data);

      setObservation("");
    }
  };

  const closeTicket = async (event, orderSelected) => {
    try {
      event.preventDefault();
      const response = await axios.post(
        CHANGE_STATE_ORDER_ENDPOINT + "/" + orderSelected.id + "/state",
        {
          state_id: 3,
        },
        {
          headers: { Authorization: user.token },
        }
      );
      4;
      if (response.status === 200) {
        toast.success("Orden N° " + orderSelected.id + " cerrada!", {
          position: "top-right",
          autoClose: false,
          newestOnTop: false,
          closeOnClick: false,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
        });
        getOrders();
        setOrderSelected(null);
      }
    } catch (errorsAxios) {
      console.log(errorsAxios);
    }
  };

  const goBackToTickets = () => {
    setOrderSelected({});
    setShowOrderSelected(false);
    setShowOrders(true);
  };

  return (
    <Container>
      <Row>
        {showOrders && (
          <Col xs="12" sm="12" md="12" lg="12" className="p-3">
            <div className="jumbotron text-center">
              <h1 className="display-4">Tickets asignados</h1>
              <p className="lead text-primary">
                {user.roles.includes("ADMIN") ||
                user.roles.includes("CALLCENTER") ? (
                  <b>{orders.length} tickets</b>
                ) : (
                  <b>
                    {
                      orders.filter((order) => order.office_id === user.office)
                        .length
                    }{" "}
                    tickets
                  </b>
                )}
              </p>
            </div>

            <Table bordered hover responsive className="text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Contrato</th>
                  <th colSpan={2}>Observacion</th>
                </tr>
              </thead>
              <tbody>
                {user.roles.includes("ADMIN") ||
                user.roles.includes("CALLCENTER")
                  ? orders.map((order) => (
                      <tr
                        key={order.id}
                        className="customRowHover"
                        onClick={() => selectTicket(order.id)}
                      >
                        <td>{order.id}</td>
                        <td>{order.date}</td>
                        <td>{order.contract}</td>
                        <td>{order.observation}</td>
                      </tr>
                    ))
                  : orders
                      .filter((order) => order.office_id === user.office)
                      .map((order) => (
                        <tr
                          key={order.id}
                          className="customRowHover"
                          onClick={() => selectTicket(order.id)}
                        >
                          <td>{order.id}</td>
                          <td>{order.date}</td>
                          <td>{order.contract}</td>
                          <td>{order.observation}</td>
                        </tr>
                      ))}
              </tbody>
            </Table>
          </Col>
        )}

        {showOrderSelected && (
          <div className="d-flex justify-content-center">
            <Col xs="12" sm="12" md="9" lg="9" className="p-3 text-center">
              <Button
                variant="primary"
                className="m-3"
                onClick={goBackToTickets}
              >
                Regresar
              </Button>
              <Card>
                <Card.Header>
                  <Card.Title className="display-6 text-center">
                    Ticket: {orderSelected.id}
                  </Card.Title>

                  <Card.Subtitle className="mb-2 text-muted text-center">
                    Estado:{" "}
                    {
                      orderSelected.states[orderSelected.states.length - 1]
                        .state
                    }
                  </Card.Subtitle>
                </Card.Header>
                <Card.Body>
                  {user.roles.includes("ADMIN") ||
                    (user.roles.includes("CONTROLCALIDAD") && (
                      <Card.Text className="text-center">
                        <Button
                          onClick={(event) => closeTicket(event, orderSelected)}
                        >
                          Cerrar ticket
                        </Button>
                      </Card.Text>
                    ))}

                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="d-flex align-items-center gap-3">
                      <GoLocation /> {offices[orderSelected.office_id - 1].name}
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex align-items-center gap-3">
                      <BsFillPersonFill />
                      {orderSelected.client_name}
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex align-items-center gap-3">
                      <AiOutlineFieldNumber />
                      <b>Contrato {orderSelected.contract}</b>
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex align-items-center gap-3">
                      <BsFillCalendarDateFill />
                      {orderSelected.date}
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex align-items-center gap-3">
                      <BsFillTelephoneFill />
                      {orderSelected.phone}
                    </ListGroup.Item>
                  </ListGroup>

                  <form
                    onSubmit={() =>
                      sendObservation(event, observation, orderSelected)
                    }
                  >
                    <div
                      className="w-100 rounded"
                      style={{
                        height: "100vh",
                        backgroundColor: "#F0F0F0",
                        overflowY: "scroll",
                        display: "flex",
                        flexDirection: "column-reverse",
                      }}
                      as="span"
                    >
                      <ListGroup>
                        <ListGroupItem className="m-2 p-2 shadow-sm rounded">
                          <p className="fw-bold text-start">Motivo inicial</p>
                          <p className="text-start">{orderSelected.observation}</p>
                        </ListGroupItem>

                        {observations.map((observation) => (
                          <ListGroupItem
                            className="m-2 p-2 shadow-sm rounded"
                            key={observation.id}
                          >
                            <div
                              className="d-flex justify-content-between"
                              as="span"
                            >
                              <p className="fw-bold" as="span">
                                {observation.username === user.username ? (
                                  <span>Tu</span>
                                ) : (
                                  <span>{observation.username}</span>
                                )}
                              </p>
                              <p>{observation.date}</p>
                            </div>
                            <p as="span" className="text-start">{observation.description}</p>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </div>

                    <InputGroup className="mt-3">
                      <Form.Control
                        type="text"
                        placeholder="Escriba un mensaje..."
                        onChange={(e) => setObservation(e.target.value)}
                        value={observation}
                        autoFocus
                      />
                      <Button type="submit" variant="dark">
                        Enviar
                      </Button>
                    </InputGroup>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </div>
        )}
      </Row>
    </Container>
  );
};

export default Tickets;
