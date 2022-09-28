import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { branchOptions } from "../../helpers/helpers";

const NewTicketForm = ({ errors, onSubmitCallback }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [agreement, setAgreement] = useState("");
  const [branch, setBranch] = useState("");
  const [phone, setPhone] = useState("");
  const [observations, setObservations] = useState("");

  const submitForm = (e) => {
    e.preventDefault();
  };

  return (
    <Form onSubmit={submitForm}>
      <Row>
        <Col xs="12" sm="12" md="5" lg="5">
          <Form.Group className="mb-3" control="id">
            <Form.Label>Identificación</Form.Label>
            <Form.Control
              type="number"
              pattern="[0-9]*"
              value={id}
              onChange={(e) => setId(e.target.value)}
              isInvalid={errors.id}
              placeholder="Ej. 0107876419001"
            />
            <Form.Control.Feedback type="invalid">
              {errors.id}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col xs="12" sm="12" md="7" lg="7">
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
              {branchOptions.map((item, index) => (
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
    </Form>
  );
};

export default NewTicketForm;
