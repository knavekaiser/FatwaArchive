import React, { createContext, useState } from "react";

export const SiteContext = createContext();
export const Provider = ({ children }) => {
  const [searchInput, setSearchInput] = useState("");
  const [lan, setLan] = useState("BN");
  return (
    <SiteContext.Provider value={{ lan, setLan, searchInput, setSearchInput }}>
      {children}
    </SiteContext.Provider>
  );
};
