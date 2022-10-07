import React, { FC, useState, useEffect } from "react";
import Button from "../buttons/CustomButtonComponent";
import "../../styles.css";

const Logout: FC = () => {


    const [showLogout, setShowLogout] = useState<boolean>(true);

  const logout = () => {
    window.location.href = "/auth/logout";
  };


  useEffect(() => {
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
        console.log("Logout SSE payload received ", e.data);
        if (e.data == "LoggedIn") {
          console.log("Logout Hide the logout button", e.data == "LoggedIn");
          setShowLogout(false);
        } else if (e.data == "NotLoggedIn") {
          console.log("Do not hide the logout button", e.data == "NotLoggedIn");
          setShowLogout(true);
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
  }, [showLogout]);

  return (
    <div>
      <Button
        disabled={showLogout}
        border="100px"
        color="#ff616f"
        height="40px"
        onClick={async () => {
          console.log("Initiating logout Server call...");
          logout();
        }}
        radius="5%"
        width="100px"
        children="Logout"
      />
    </div>
  );
};

export default Logout;
