import React, { createContext, useContext, useState } from "react";
import { View, Text, Button } from "react-native";
import { MyContext } from "./Context";

// Step 2: Provide the Context
const MyProvider = ({ children }: any) => {
  const [user, setUser] = useState([]);
  const [login, setLogin] = useState("");
  const [logout, setLogout] = useState("");

  return (
    <MyContext.Provider
      value={{ user, setUser, login, setLogin, logout, setLogout }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
