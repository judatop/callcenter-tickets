import { authenticate, logout } from "../../utils/auth";
import produce from "immer";

export const authInitialState = authenticate();

export const AuthReducer = produce((state, action) => {
  switch (action.type) {
    case "login":
      state = authenticate(action.token);
      return state;
    case "logout":
      state = logout();
      return state;
    default:
      return state;
  }
});
