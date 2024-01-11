import React, { FC, useState, useEffect } from "react";
import Button from "../buttons/CustomButtonComponent";
import "../../styles.css";

interface ICRMData {
  id?: string;
  issued_at?: string;
  instance_url?: string;
  signature?: string;
  access_token: string;
}

interface token_received {
  token_received?: boolean;
}

const defaultCRMData: ICRMData[] = [];

const Login: FC = () => {
  const login = () => {
    console.log("Login initiated ....", "Start");
    window.location.href = "/auth/login";
  };

  const [data, setData] = useState<ICRMData[]>(defaultCRMData);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isLoggedIn, setLoggedIn] = useState<token_received | false>(false);
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [logged, setLogged] = useState<string | undefined>("NotLoggedIn");

  useEffect(() => {
    try {
      console.log("Login - useEffect - start");
      console.log("Login - useEffect - end");
      // const source = new EventSource(`/auth/token`);
      // source.addEventListener(
      //   "open",
      //   () => {
      //     console.log("SSE opened!");
      //   },
      //   false
      // );

      // source.addEventListener(
      //   "message",
      //   (e: any) => {
      //     console.log("SSE payload received ", e.data);
      //     if (e.data == "LoggedIn") {
      //       console.log("Hide the login button", e.data == "LoggedIn");
      //       setLogged(undefined);
      //       setShowLogin(false);
      //     } else if (e.data == "NotLoggedIn") {
      //       console.log(
      //         "Do not hide the login button",
      //         e.data == "NotLoggedIn"
      //       );
      //       setShowLogin(true);
      //     }
      //   },
      //   false
      // );
      // source.addEventListener(
      //   "error",
      //   (e) => {
      //     console.error("Error: ", e);
      //   },
      //   false
      // );
      // return () => {
      //   source.close();
      // };
    } catch (error) {
      console.error("Error fetching server side events in login event ", error);
    }
  }, [logged]);

  return (
    <div>
      <Button
        disabled={!showLogin}
        border="100px"
        color="#03a9f4"
        height="40px"
        onClick={async () => {
          console.log("Initiating Server call...");
          login();
        }}
        radius="5%"
        width="100px"
        children="Login"
      />
    </div>
  );
};

export default Login;
