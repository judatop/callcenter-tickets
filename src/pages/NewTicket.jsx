import { useState } from "react";
import NewTicketForm from "../components/forms/NewTicketForm";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import validator from "validator";
import { isObjEmpty } from "../helpers/helpers";

const NewTicket = () => {
  const [errors, setErrors] = useState({});

  const newTicket = async () => {};

  return (
    <Container className="mt-5 mb-5">
      <Row>
        <Col sm="12" lg={{ span: 10, offset: 1 }}>
          <Card body>
            {errors.newpost && <Alert variant="danger">{errors.auth}</Alert>}

            <h3>Crear ticket</h3>
            <hr></hr>
            <NewTicketForm
              errors={errors}
              onSubmitCallback={newTicket}
            ></NewTicketForm>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NewTicket;
