import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import {
  GET_STATES_ENDPOINT,
  GET_OFFICES_ENDPOINT,
  GET_PROBLEMS_ENDPOINT,
} from "../../helpers/endpoints";
import { useAuthState } from "../../context/authContext.jsx";
import axios from "axios";

const NewTicketForm = ({ errors, onSubmitCallback }) => {
  const user = useAuthState();
  const [name, setName] = useState(""); // nombre del cliente
  const [agreement, setAgreement] = useState(""); // contrato
  const [branch, setBranch] = useState(""); // sucursal
  const [phone, setPhone] = useState(""); // telefono
  const [observations, setObservations] = useState(""); // observaciones
  const [states, setStates] = useState([]);
  const [offices, setOffices] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState("");

  useEffect(() => {
    const getStates = async () => {
      try {
        const response = await axios.get(GET_STATES_ENDPOINT, {
          headers: { Authorization: user.token },
        });
        setStates(response.data.states);
      } catch (errors) {
        console.log(errors);
      }
    };

    const getOffices = async () => {
      try {
        const response = await axios.get(GET_OFFICES_ENDPOINT, {
          headers: { Authorization: user.token },
        });
        setBranch(response.data.offices[0].name); // definimos por defecto la primera sucursal
        setOffices(response.data.offices);
      } catch (errors) {
        console.log(errors);
      }
    };

    const getProblems = async () => {
      try {
        const response = await axios.get(GET_PROBLEMS_ENDPOINT, {
          headers: { Authorization: user.token },
        });
        setSelectedProblem(response.data.problems[0].name);
        setProblems(response.data.problems);
      } catch (errors) {
        console.log(errors);
      }
    };

    getStates();
    getOffices();
    getProblems();
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    onSubmitCallback(
      name,
      agreement,
      offices.find((office) => office.name === branch),
      phone,
      observations,
      problems.find((problem) => problem.name === selectedProblem)
    );
  };

  return (
    <Form onSubmit={submitForm}>
      <Row>
        <Col xs="12" sm="12" md="8" lg="8">
          <Form.Group className="mb-3" control="name">
            <Form.Label>Nombre del cliente</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={errors.name}
              placeholder="Ej. Juan Perez"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col xs="12" sm="12" md="4" lg="4">
          <Form.Group className="mb-3" control="selectedProblem">
            <Form.Label>Problemas</Form.Label>
            <Form.Select
              value={selectedProblem}
              onChange={(e) => setSelectedProblem(e.target.value)}
              isInvalid={errors.selectedProblem}
            >
              {problems.map((item, index) => (
                <option key={index}>{item.name}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.selectedProblem}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xs="12" sm="12" md="4" lg="4">
          <Form.Group className="mb-3" control="agreement">
            <Form.Label>Número de contrato</Form.Label>
            <Form.Control
              type="number"
              pattern="[0-9]*"
              value={agreement}
              onChange={(e) => setAgreement(e.target.value)}
              isInvalid={errors.agreement}
              placeholder="Ej. 123456789"
            />
            <Form.Control.Feedback type="invalid">
              {errors.agreement}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col xs="12" sm="12" md="4" lg="4">
          <Form.Group className="mb-3" control="branch">
            <Form.Label>Sucursal</Form.Label>
            <Form.Select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              isInvalid={errors.branch}
            >
              {offices.map((item, index) => (
                <option key={index}>{item.name}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.branch}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col xs="12" sm="12" md="4" lg="4">
          <Form.Group className="mb-3" control="agreement">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="number"
              pattern="[0-9]*"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isInvalid={errors.phone}
              placeholder="Ej. 0987654321"
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xs="12" sm="12" md="12" lg="12">
          <Form.Group className="mb-3" control="description">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              isInvalid={errors.observations}
              placeholder="Ej. El cliente presenta servicio de internet muy lento."
            />
            <Form.Control.Feedback type="invalid">
              {errors.observations}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <div className="text-center">
        <Button variant="dark" type="submit">
          Crear ticket
        </Button>
      </div>
    </Form>
  );
};

export default NewTicketForm;
