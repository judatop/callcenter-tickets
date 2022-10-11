import { useState } from "react";
import NewTicketForm from "../components/forms/NewTicketForm";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import validator from "validator";
import { isObjEmpty } from "../helpers/helpers";
import { CREATE_ORDERS_ENDPOINT } from "../helpers/endpoints";
import { useAuthState } from "../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TICKETS_URL } from "../helpers/urls.js";

const NewTicket = () => {
  const user = useAuthState();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const newTicket = async (
    id,
    name,
    agreement,
    office,
    phone,
    observations,
    state
  ) => {
    const errors = {};

    if (validator.isEmpty(id)) {
      errors.id = "El campo identificación es obligatorio";
    }

    if (!validator.isLength(id, { max: 13 })) {
      errors.id = "El campo identificacion debe tener máximo 13 caracteres";
    }

    if (validator.isEmpty(name)) {
      errors.name = "El campo nombre es obligatorio";
    }

    if (!validator.isLength(name, { max: 100 })) {
      errors.name = "El campo nombre debe tener máximo 100 caracteres";
    }

    if (validator.isEmpty(agreement)) {
      errors.agreement = "El campo contrato es obligatorio";
    }

    if (!validator.isLength(agreement, { max: 7 })) {
      errors.agreement = "El campo nombre debe tener máximo 7 caracteres";
    }

    if (validator.isEmpty(office.name)) {
      errors.branch = "El campo sucursal es obligatorio";
    }

    if (validator.isEmpty(phone)) {
      errors.phone = "El campo teléfono es obligatorio";
    }

    if (!validator.isLength(phone, { max: 15 })) {
      errors.phone = "El campo telefono debe tener máximo 15 caracteres";
    }

    if (validator.isEmpty(observations)) {
      errors.observations = "El campo observaciones es obligatorio";
    }

    if (!validator.isLength(observations, { max: 300 })) {
      errors.observations = "El campo observacion debe tener máximo 300 caracteres";
    }

    if (!isObjEmpty(errors)) {
      setErrors(errors);
      return;
    }

    const jsonRequest = {
      client_ruc: id,
      client_name: name,
      contract: parseInt(agreement),
      observation: observations,
      office_id: office.id,
      phone: phone,
      user_id: user.id,
    };

    try {
      const response = await axios.post(CREATE_ORDERS_ENDPOINT, jsonRequest, {
        headers: {
          Authorization: user.token,
          ContentType: "application/json",
          Accept: "application/json",
        },
      });
      if (response.status == 200) {
        toast.success("Ticket creado correctamente", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      navigate(TICKETS_URL);
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
