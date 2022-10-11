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
import { colorCbvision } from "../helpers/helpers.js";
import cardHover from "../styles/cardHover.css";
import { GET_DETAILS_ORDER_ENDPOINT } from "../helpers/endpoints.js";
import moment from "moment";
import validator from "validator";
import { toast } from "react-toastify";
import { GoLocation } from "react-icons/go";
const socket = io(API_ENDPOINT);

const Tickets = () => {
  const [orders, setOrders] = useState([]);
  const [orderSelected, setOrderSelected] = useState(null);
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

  const selectTicket = async (event, idOrder) => {
    event.preventDefault();
    const orderSelected = orders.filter((order) => order.id === idOrder)[0];

    // Obtenemos observaciones de la orden seleccionada
    getObservationsByOrder(idOrder);
    setOrderSelected(orderSelected);
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

  return (
    <Container>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-3">
          <Card>
            <Card.Header className="text-center p-3">
              <Card.Title>Ordenes asignadas</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user.roles.includes("ADMIN") ||
                user.roles.includes("CALLCENTER") ? (
                  <div>{orders.length} ordenes</div>
                ) : (
                  <div>
                    {
                      orders.filter((order) => order.office_id === user.office)
                        .length
                    }{" "}
                    ordenes
                  </div>
                )}
              </Card.Subtitle>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {user.roles.includes("ADMIN") ||
                user.roles.includes("CALLCENTER") ? (
                  <div style={{ height: "70vh", overflowY: "scroll" }}>
                    {orders.map((order) => (
                      <div key={order.id}>
                        <ListGroup.Item
                          className="shadow-sm m-3 rounded"
                          id="customCard"
                          onClick={(event) => selectTicket(event, order.id)}
                        >
                          <Row>
                            <Col xs="12" sm="12" md="10" lg="10">
                              <b>Orden N° {order.id}</b>
                              <p>{order.date}</p>
                              <p>{order.client_name}</p>
                              <p>- {order.observation}</p>
                            </Col>
                            <Col
                              xs="12"
                              sm="12"
                              md="2"
                              lg="2"
                              className="text-end align-self-center"
                            ></Col>
                          </Row>
                        </ListGroup.Item>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {orders.map((order) => (
                      <div key={order.id}>
                        {order.office_id === user.office && (
                          <ListGroup.Item
                            className="shadow-sm m-3 rounded"
                            id="customCard"
                            onClick={(event) => selectTicket(event, order.id)}
                          >
                            <Row>
                              <Col xs="12" sm="12" md="10" lg="10">
                                <b>Orden N° {order.id}</b>
                                <p>{order.date}</p>
                                <p>{order.client_name}</p>
                                <p>{order.observation}</p>
                              </Col>
                              <Col
                                xs="12"
                                sm="12"
                                md="2"
                                lg="2"
                                className="text-end align-self-center"
                              ></Col>
                            </Row>
                          </ListGroup.Item>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-3">
          <Card>
            {orderSelected ? (
              <Card.Body>
                <Card.Title className="text-center">
                  Orden N° {orderSelected.id}
                </Card.Title>

                <Card.Subtitle className="mb-2 text-muted text-center">
                  Estado:{" "}
                  {orderSelected.states[orderSelected.states.length - 1].state}
                </Card.Subtitle>

                <Card.Text className="text-center">
                  {user.roles.includes("ADMIN") ||
                    (user.roles.includes("CALLCENTER") && (
                      <Button
                        onClick={(event) => closeTicket(event, orderSelected)}
                      >
                        Cerrar ticket
                      </Button>
                    ))}
                </Card.Text>

                <ListGroup>
                  <Row className="mt-3 mb-3">
                    <Col xs="12" sm="12" md="12" lg="12">
                      <ListGroup.Item className="d-flex align-items-center gap-3">
                        <GoLocation />{" "}
                        {offices[orderSelected.office_id - 1].name}
                      </ListGroup.Item>
                    </Col>

                    <Col xs="12" sm="12" md="12" lg="12">
                      <ListGroup.Item className="d-flex align-items-center gap-3">
                        <HiIdentification /> {orderSelected.client_ruc}
                      </ListGroup.Item>
                    </Col>

                    <Col xs="12" sm="12" md="12" lg="12">
                      <ListGroup.Item className="d-flex align-items-center gap-3">
                        <BsFillPersonFill />
                        <b>{orderSelected.client_name}</b>
                      </ListGroup.Item>
                    </Col>

                    <Col xs="12" sm="12" md="12" lg="12">
                      <ListGroup.Item className="d-flex align-items-center gap-3">
                        <AiOutlineFieldNumber />
                        <b>Contrato {orderSelected.contract}</b>
                      </ListGroup.Item>
                    </Col>

                    <Col xs="12" sm="12" md="12" lg="12">
                      <ListGroup.Item className="d-flex align-items-center gap-3">
                        <BsFillCalendarDateFill />
                        {orderSelected.date}
                      </ListGroup.Item>
                    </Col>

                    <Col xs="12" sm="12" md="12" lg="12">
                      <ListGroup.Item className="d-flex align-items-center gap-3">
                        <BsFillTelephoneFill />
                        {orderSelected.phone}
                      </ListGroup.Item>
                    </Col>
                  </Row>
                </ListGroup>

                <form
                  onSubmit={() =>
                    sendObservation(event, observation, orderSelected)
                  }
                >
                  <div
                    className="w-100 rounded"
                    style={{
                      height: "50vh",
                      backgroundColor: "#F0F0F0",
                      overflowY: "scroll",
                      display: "flex",
                      flexDirection: "column-reverse",
                    }}
                  >
                    <ListGroup>
                      <ListGroupItem className="m-3 p-3 shadow-sm rounded">
                        <div className="fw-bold">Motivo inicial</div>
                        <p>{orderSelected.observation}</p>
                      </ListGroupItem>

                      {observations.map((observation) => (
                        <ListGroupItem
                          className="m-3 p-3 shadow-sm rounded"
                          key={observation.id}
                        >
                          <div className="d-flex justify-content-between">
                            <p className="fw-bold">
                              {observation.username === user.username ? (
                                <p>Tu</p>
                              ) : (
                                <p>{observation.username}</p>
                              )}
                            </p>
                            <p>{moment(observation.date).format("LLL")}</p>
                          </div>
                          <p>{observation.description}</p>
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
            ) : (
              <Card.Body>
                Seleccione un ticket para visualizar su informacion
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Tickets;
