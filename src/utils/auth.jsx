import axios from "axios";
const TOKEN_KEY = "token";
import jwtDecode from "jwt-decode";

const defaultUser = {
  id: "",
  username: "",
  token: "",
  office: "",
  roles: [],
  isAuthenticated: false,
};

const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || null;
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const authenticate = (token) => {
  if (token) {
    setToken(token);
  }

  const _token = token ? token : getToken();

  if (!_token) {
    return { ...defaultUser };
  }

  const decoded = jwtDecode(_token);

  const currentTime = Date.now() / 1000;

  if (decoded.expiration < currentTime) {
    removeToken();
    return { ...defaultUser };
  }

  axios.defaults.headers.common["Authorization"] = token;

  return {
    ...defaultUser,
    id: decoded.id_usuario,
    username: decoded.user,
    isAuthenticated: true,
    office: decoded.office_id,
    roles: decoded.roles,
    token: _token,
  };
};

export const logout = () => {
  removeToken();
  delete axios.defaults.headers.common["Authorization"];
  return { ...defaultUser };
};
