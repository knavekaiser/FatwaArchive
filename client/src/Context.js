import React, { createContext, useState } from "react";

export const SiteContext = createContext();
export const Provider = ({ children }) => {
  const [locale, setLocale] = useState("bn-BD");
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lan, setLan] = useState("bn");
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
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
