import { useState } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import LoginForm from "../components/forms/LoginForm";
import { isObjEmpty } from "../helpers/helpers.js";

const Login = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const login = ({ email, password }) => {
    const errors = {};
    setErrors(errors);
    if (!validator.isEmail(email)) {
      errors.email = "El correo electronico es invalido";
    }

    if (validator.isEmpty(password)) {
      errors.password = "La clave no puede estar vacia";
    }

    if (!isObjEmpty(errors)) {
      setErrors(errors);
      return;
    }

    navigate("/home");
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm="12" md={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
          <Card body>
            {errors.auth && <Alert variant="danger">{errors.auth}</Alert>}

            <h3>Iniciar sesion</h3>
            <hr></hr>
            <LoginForm errors={errors} onSubmitCallback={login}></LoginForm>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
