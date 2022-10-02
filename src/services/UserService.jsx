import axios from "axios";
import { LOGIN_ENDPOINT } from "../helpers/endpoints.js";

export const loginUser = (username, password) => {
  return axios.post(
    LOGIN_ENDPOINT,
    {
      username,
      password,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }
  );
};
