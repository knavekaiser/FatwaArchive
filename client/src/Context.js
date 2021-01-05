import React, { createContext, useState } from "react";

export const SiteContext = createContext();
export const Provider = ({ children }) => {
  const [locale, setLocale] = useState("bn-BD");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fatwaToEdit, setFatwaToEdit] = useState(null);
  const [sidebarSize, setSidebarSize] = useState(() =>
    window.innerWidth <= 1080 ? "mini" : "full"
  );
  return (
    <SiteContext.Provider
      value={{
        locale,
        setLocale,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        fatwaToEdit,
        setFatwaToEdit,
        sidebarSize,
        setSidebarSize,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
