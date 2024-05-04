import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const StatusContext = createContext();

export default function Status({ Compoment }) {
  const [isLoading, SetIsLoading] = useState(false);
  const [isSideBar, SetIsSideBar] = useState({
    Sidebar: true,
    Footer: true,
  });
  const [Account, setAccount] = useState({});

  const Email = window.localStorage.getItem("Email");
  const Password = window.localStorage.getItem("TokenPs");

  const ChangeAccount = () => {
    if (Email) {
      axios
        .post("http://localhost:9000/Account/GetAccount", {
          Email: Email,
          Password: Password,
        })
        .then((rs) => {
          if (rs.data.Status !== "Fauld") {
            setAccount(rs.data);

          } else {
            setAccount({
              _id: "",
              Name: "",
              Email: "",
              Password: "",
              Type: ""
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    ChangeAccount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Email, Password]);

  return (
    <StatusContext.Provider
      value={[
        isLoading,
        SetIsLoading,
        isSideBar,
        SetIsSideBar,
        Account,
        setAccount,
        ChangeAccount
      ]}
    >
      {Compoment}
    </StatusContext.Provider>
  );
}