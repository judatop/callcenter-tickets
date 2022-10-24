import React, { useState, useEffect } from "react";
import {
  Col,
  Card,
  ListGroup,
  Button,
  Form,
  InputGroup,
  ListGroupItem,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { GET_ORDERS_ENDPOINT, GET_STATES_ENDPOINT, GET_OFFICES_ENDPOINT, GET_DETAILS_ORDER_ENDPOINT } from "../helpers/endpoints";
import axios from "axios";
import { useAuthState } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";
import { TICKETS_URL } from "../helpers/urls";
import { GoLocation } from "react-icons/go";
import { BsFillPersonFill } from "react-icons/bs";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { BsFillTelephoneFill } from "react-icons/bs";

const TicketDetail = () => {
  const params = useParams();
  const ticketId = params.ticketId;
  const [ticket, setTicket] = useState({});
  const user = useAuthState();
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [offices, setOffices] = useState([]);
  const [observations, setObservations] = useState([]);
  const [observation, setObservation] = useState("");

  useEffect(() => {
    const getTicket = async () => {
      try {
        const response = await axios.get(GET_ORDERS_ENDPOINT + "/" + ticketId, {
          headers: { Authorization: user.token },
        });
        setTicket(response.data);
      } catch (errorsAxios) {
        console.log(errorsAxios);
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

    const getObservations = async () => {
      try {
        const response = await axios.get(
          GET_DETAILS_ORDER_ENDPOINT + "/" + ticketId,
          {
            headers: { Authorization: user.token },
          }
        );
        setObservations(response.data.Detalles);
      } catch (errorsAxios) {
        console.log(errorsAxios);
      }
    }

    getTicket();
    getStates();
    getOffices();
    
    getObservations();
    
  }, []);

  const goBackToTickets = () => {
    navigate(TICKETS_URL);
  };

  const closeTicket = async (event) => {
    event.preventDefault();
  
  };

  const sendObservation = (event, observation) => {
    event.preventDefault();

    
  };



  return (
    <div className="d-flex justify-content-center">
      <Col xs="12" sm="12" md="9" lg="9" className="p-3 text-center">
        <Card>
          <Card.Header>
            <Card.Title className="display-6 text-center">
              Ticket: {ticket.id}
            </Card.Title>

            <Card.Subtitle className="mb-2 text-muted text-center">
              {/* Estado: {ticket.states[ticket.states.length - 1].state} */}
            </Card.Subtitle>
          </Card.Header>
          <Card.Body>
            <Card.Text className="text-center">
              <Button onClick={(event) => closeTicket(event, ticket)}>
                Cerrar ticket
              </Button>
            </Card.Text>

            <ListGroup variant="flush" className="mb-3">
              <ListGroup.Item className="d-flex align-items-center gap-3">
                {/* <GoLocation /> {offices && offices[ticket.office_id - 1].name} */}
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center gap-3">
                <BsFillPersonFill />
                {ticket.client_name}
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center gap-3">
                <AiOutlineFieldNumber />
                <b>Contrato {ticket.contract}</b>
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center gap-3">
                <BsFillCalendarDateFill />
                {ticket.date}
              </ListGroup.Item>

              <ListGroup.Item className="d-flex align-items-center gap-3">
                <BsFillTelephoneFill />
                {ticket.phone}
              </ListGroup.Item>
            </ListGroup>

            <form onSubmit={() => sendObservation(observation)}>
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
                    <p className="text-start">{ticket.observation}</p>
                  </ListGroupItem>

                  {observations.map((observation) => (
                    <ListGroupItem
                      className="m-2 p-2 shadow-sm rounded"
                      key={observation.id}
                    >
                      <div className="d-flex justify-content-between" as="span">
                        <p className="fw-bold" as="span">
                          {observation.username === user.username ? (
                            <span>Tu</span>
                          ) : (
                            <span>{observation.username}</span>
                          )}
                        </p>
                        <p>{observation.date}</p>
                      </div>
                      <p as="span" className="text-start">
                        {observation.description}
                      </p>
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
  );
};

export default TicketDetail;
