import React from "react";
import { EmojiFrown } from "react-bootstrap-icons";
import notFound from "../assets/notfound.svg";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center p-5">
      <Card className="text-center">
        <div>
          <Card.Img variant="top" src={notFound} className="w-50" />
        </div>

        <Card.Body>
          <Card.Title>404 Página no encontrada</Card.Title>
          <Card.Text>
            Parece que esta página no existe, por favor verifique la URL o pulse
            el botón para ir a la página principal.
          </Card.Text>
          <Button variant="primary" onClick={() => navigate("/home")}>
            Ir a la página principal
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NotFound;
