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
const socket = io(API_ENDPOINT);

const Tickets = () => {
  const [orders, setOrders] = useState([]);
  const [orderSelected, setOrderSelected] = useState({});
  const user = useAuthState();
  const [states, setStates] = useState([]);
  const [offices, setOffices] = useState([]);
  const socketRef = useRef();
  const [observation, setObservation] = useState("");
  const [errors, setErrors] = useState({});
  const [observations, setObservations] = useState([]);

  useEffect(() => {
    socketRef.current = io.connect({ API_ENDPOINT });
    socket.emit("join", {
      office_id: user.office,
      roles: user.roles,
    });

    socket.on("new_message", (data) => {
      console.log("recibido", data);
    });
  }, []);

  // Obtenemos tickets
  useEffect(() => {
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
  }, []);

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

    const data = {
      office_id: orderSelected.office_id,
      description: observation,
      order_id: orderSelected.id,
      username: user.username,
    };

    socket.emit("new_message", data);
  };

  return (
    <Container>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-3">
          <Card>
            <Card.Header className="text-center p-3">
              <Card.Title>Tickets asignados</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user.roles.includes("ADMIN") ||
                user.roles.includes("CALLCENTER") ? (
                  <div>{orders.length} tickets</div>
                ) : (
                  <div>
                    {
                      orders.filter((order) => order.office_id === user.office)
                        .length
                    }
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
                              <p>{moment(order.date).fromNow()}</p>
                              <p>{order.client_ruc}</p>
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
                                <p>{order.client_ruc}</p>
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
            {orderSelected.id ? (
              <Card.Body>
                <Card.Title className="text-center">
                  Orden N° {orderSelected.id}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {/* {orderSelected.states.map((state) => state.state)} */}
                </Card.Subtitle>
                <ListGroup>
                  <Row className="mt-3 mb-3">
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
                    }}
                  >
                    <ListGroup>
                      <ListGroupItem className="m-3 p-3 shadow-sm rounded">
                        <div className="fw-bold">Tu</div>
                        <p>{orderSelected.observation}</p>
                      </ListGroupItem>

                      {observations.map((observation) => (
                        <ListGroupItem className="m-3 p-3 shadow-sm rounded" key={observation.id}>
                          <div className="fw-bold">{observation.date}</div>
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
