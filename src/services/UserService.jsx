import axios from "axios";
import { LOGIN_URL } from "../helpers/endpoints";

export const loginUser = (username, password) => {
  return axios.post(
    LOGIN_URL,
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
