import React, { FC, useState } from "react";
import Button from "../buttons/CustomButtonComponent";
import "../../styles.css";

const Logout: FC = () => {
  const logout = () => {
    window.location.href = "/auth/logout";
  };

  return (
    <div>
      <Button
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
