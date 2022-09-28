import { createContext, useContext, useReducer } from "react";
import {
  authInitialState,
  AuthReducer,
} from "../state/reducers/authReducer.jsx";

export const AuthStateContext = createContext(authInitialState);
// export const AuthStateContext = createContext<{
//     email, token, isAuthenticated
// }>(authInitialState);
export const AuthDispatchContext = createContext(() => undefined);
// export const AuthDispatchContext = createContext<{ type: 'login', token: string } | { type: 'logout' }>(() => undefined);

export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, authInitialState);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);

  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }

  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);

  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within a AuthProvider");
  }

  return context;
};
