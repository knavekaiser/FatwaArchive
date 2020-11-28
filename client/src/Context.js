import React, { createContext, useState } from "react";

export const SiteContext = createContext();
export const Provider = ({ children }) => {
  const [locale, setLocale] = useState("bn-BD");
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lan, setLan] = useState("bn");
  const [fatwaToEdit, setFatwaToEdit] = useState(null);
  const [sidebarSize, setSidebarSize] = useState(() =>
    window.innerWidth <= 1080 ? "mini" : "full"
  );
  const [jamias, setJamias] = useState([]);
  return (
    <SiteContext.Provider
      value={{
        locale,
        setLocale,
        lan,
        setLan,
        searchInput,
        setSearchInput,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        fatwaToEdit,
        setFatwaToEdit,
        sidebarSize,
        setSidebarSize,
        jamias,
        setJamias,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
