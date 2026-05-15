import { createContext, useContext, useState, useEffect } from "react";

function parseJwt(token: string) {
  return JSON.parse(atob(token.split('.')[1]));
}

type AuthState = {
  token: string | null;
  role: string | null;
  userId: string | null;
};

const AuthContext = createContext<{
  auth: AuthState;
  login: (token: string) => void;
  logout: () => void;
}>({
  auth: { token: null, role: null, userId: null },
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    role: null,
    userId: null
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      setAuth({
        token,
        role: payload.role,
        userId: payload.sub
      });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const payload = parseJwt(token);

    setAuth({
      token,
      role: payload.role,
      userId: payload.sub
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, role: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
