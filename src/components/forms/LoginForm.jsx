import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const LoginForm = ({ errors, onSubmitCallback }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    onSubmitCallback({ email, password });
  };

  return (
    <Form onSubmit={submitForm}>
      <Form.Group control="email">
        <Form.Label>Correo electronico</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electronico"
          isInvalid={errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
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
