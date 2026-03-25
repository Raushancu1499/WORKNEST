import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
import { clearAuth, loadAuth, saveAuth } from "./storage";

const AuthContext = createContext(null);

function mapAuthResponse(response) {
  return {
    token: response.token,
    user: {
      id: response.id,
      fullName: response.fullName,
      email: response.email,
      role: response.role,
      city: response.city
    }
  };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth());
  const [isReady, setIsReady] = useState(false);
  const [sessionNotice, setSessionNotice] = useState("");

  useEffect(() => {
    const stored = loadAuth();

    if (!stored?.token) {
      setIsReady(true);
      return undefined;
    }

    let active = true;
    setAuth(stored);

    api.me(stored.token)
      .then((user) => {
        if (!active) {
          return;
        }

        const nextAuth = {
          token: stored.token,
          user: {
            ...stored.user,
            ...user
          }
        };

        saveAuth(nextAuth);
        setAuth(nextAuth);
        setSessionNotice("");
      })
      .catch(() => {
        if (!active) {
          return;
        }

        clearAuth();
        setAuth(null);
        setSessionNotice("Your previous session expired. Sign in again to continue.");
      })
      .finally(() => {
        if (active) {
          setIsReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function authenticate(runRequest) {
    const response = await runRequest();
    const nextAuth = mapAuthResponse(response);
    saveAuth(nextAuth);
    setAuth(nextAuth);
    setSessionNotice("");
    return nextAuth;
  }

  async function login(payload) {
    return authenticate(() => api.login(payload));
  }

  async function register(payload) {
    return authenticate(() => api.register(payload));
  }

  async function refreshUser() {
    if (!auth?.token) {
      return null;
    }

    const user = await api.me(auth.token);
    const nextAuth = {
      token: auth.token,
      user: {
        ...auth.user,
        ...user
      }
    };
    saveAuth(nextAuth);
    setAuth(nextAuth);
    return user;
  }

  function logout() {
    clearAuth();
    setAuth(null);
    setSessionNotice("");
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        token: auth?.token || null,
        user: auth?.user || null,
        isReady,
        sessionNotice,
        login,
        register,
        refreshUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
