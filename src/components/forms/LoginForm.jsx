import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const LoginForm = ({ errors, onSubmitCallback }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    onSubmitCallback({ username, password });
  };

  return (
    <Form onSubmit={submitForm}>
      <Form.Group control="username">
        <Form.Label>Usuario</Form.Label>
        <Form.Control 
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario"
          isInvalid={errors.username}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group control="password" className="mt-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Clave"
          isInvalid={errors.password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Check
          type="checkbox"
          label="Mostrar contraseña"
          onClick={() => {
            setshowPassword(!showPassword);
          }}
        />
      </Form.Group>

      <div className="d-flex justify-content-center mt-3">
        <Button variant="primary" type="submit">
          Ingresar
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
