import axios from "axios";
import { GET_ORDERS_URL } from "../helpers/endpoints.js";

export const getOrders = () => {
  return axios.get(GET_ORDERS_URL);
};
