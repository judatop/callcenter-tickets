import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, ListGroup, Button } from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";
import { getOrders } from "../services/OrderService.jsx";
import { useAuthState } from "../context/authContext.jsx";
import axios from "axios";
import { GET_ORDERS_ENDPOINT } from "../helpers/endpoints.js";

const Tickets = () => {
  const [orders, setOrders] = useState([]);
  const user = useAuthState();

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

    getOrders();
  }, []);

  return (
    <Container>
      <Row>
        <Col xs="12" sm="12" md="6" lg="6" className="p-3">
          <Card>
            <Card.Header className="text-center p-3">
              <Card.Title>Tickets asignados</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Cuenca</Card.Subtitle>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {orders.map((order) => (
                  <div key={order.id}>
                    <ListGroup.Item className="shadow-sm m-1 rounded">
                      <Row>
                        <Col xs="12" sm="12" md="10" lg="10">
                          <b>Orden N° {order.id}</b>
                          <p>{order.date}</p>
                          <p>{order.client_ruc}</p>
                          <p>{order.observation}</p>
                        </Col>
                        <Col
                          xs="12"
                          sm="12"
                          md="2"
                          lg="2"
                          className="text-end align-self-center"
                        >
                          <Button size="sm">
                            <BsArrowRight />
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </div>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col xs="12" sm="12" md="6" lg="6" className="p-3">
          <Card>
            <Card.Body>
              <Card.Title>Ticket #123</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                En proceso
              </Card.Subtitle>
              <Card.Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Card.Text>
              <Card.Link href="#" className="text-danger">
                Eliminar
              </Card.Link>
              <Card.Link href="#">Finalizar</Card.Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Tickets;
