import React, { FC, useState, useEffect } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";

const Authenticate: FC = () => {
  const [auth, setAuth] = useState(false);
  const [progress, setProgress] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(true)
    if (!auth) {
      console.log("Login initiated ....", "Start");
      window.location.href = "/auth/login";
      
    } else if (auth) {
      console.log("Logout initiated ....", "Start");
      window.location.href = "/auth/logout";
    }
    console.log("Clicked switch control");
  };

  useEffect(() => {
    try {
      console.log("authenticate - useEffect - start");
      console.log("authenticate - useEffect - end");
      const source = new EventSource(`/auth/token`);
      source.addEventListener(
        "open",
        () => {
          console.log("SSE opened!");
        },
        false
      );

      source.addEventListener(
        "message",
        (e: any) => {
          console.log("SSE payload received ", e.data);
          setProgress(false)
          if (e.data == "LoggedIn") {
            console.log("Hide the login button", e.data == "LoggedIn");
            setAuth(true);
          } else if (e.data == "NotLoggedIn") {
            console.log(
              "Do not hide the login button",
              e.data == "NotLoggedIn"
            );
            setAuth(false);
          }
        },
        false
      );
      source.addEventListener(
        "error",
        (e) => {
          console.error("Error: ", e);
        },
        false
      );
      return () => {
        source.close();
      };
    } catch (error) {
      console.error("Error fetching server side events in login event ", error);
    }
  }, []);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={auth}
            onChange={handleChange}
            aria-label="login switch"
          />
        }
        label={auth ? "Logout" : "Login"}
      />
    {progress ? <CircularProgress /> : ''}
    </FormGroup>
  );
};

export default Authenticate;
