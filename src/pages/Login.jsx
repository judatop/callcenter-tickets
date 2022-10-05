import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import LoginForm from "../components/forms/LoginForm";
import { useAuthDispatch, useAuthState } from "../context/authContext";
import { isObjEmpty } from "../helpers/helpers.js";
import { loginUser } from "../services/UserService";
import { toast } from "react-toastify";

const Login = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const authDispatch = useAuthDispatch();
  const user = useAuthState();

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate("/home");
    }
  });

  const login = async ({ username, password }) => {
    const errors = {};
    setErrors(errors);
    if (validator.isEmpty(username)) {
      errors.username = "Debe ingresar su usuario";
    }

    if (validator.isEmpty(password)) {
      errors.password = "Debe ingresar su clave";
    }

    if (!isObjEmpty(errors)) {
      setErrors(errors);
      return;
    }

    try {
      const response = await loginUser(username, password);
      const token = response.data.token;
      authDispatch({
        type: "login",
        token,
      });

      toast.success("Bienvenido " + username, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/home");
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
