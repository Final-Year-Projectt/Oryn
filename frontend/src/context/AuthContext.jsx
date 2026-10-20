import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const DEMO_EMAIL = "demo@oryn.com";
const DEMO_PASSWORD = "OrynDemo123";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("oryn_demo_auth") === "true"
  );

  const login = (email, password) => {
    if (
      email.trim().toLowerCase() === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      sessionStorage.setItem("oryn_demo_auth", "true");
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      message: "Invalid demo email or password.",
    };
  };

  const logout = () => {
    sessionStorage.removeItem("oryn_demo_auth");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}