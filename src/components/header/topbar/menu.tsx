import React, { useContext, FC, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";

import { useMenuGlobalContext } from "../context/globalmenucontext";
import { Toolbar } from "@mui/material";

const MenuBar: FC = () => {
  const { menu, setMenu } = useMenuGlobalContext();

  const handleQueryClick = () => {
    setMenu("Query");
  };

  const handleHomeClick = () => {
    setMenu("Home");
  };

  const handleEventsClick = () => {
    setMenu("Events")
  }
  const handleKafkaClick = () => {
    setMenu("Kafka")
  }


  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          onClick={handleHomeClick}
          variant="h6"
          component="div"
          margin="10px"
        >
          Home
        </Typography>

        <Typography
          onClick={handleQueryClick}
          variant="h6"
          component="div"
          margin="10px"
        >
          Query
        </Typography>

        <Typography
          onClick={handleEventsClick}
          variant="h6"
          component="div"
          margin="10px"
        >
          Events
        </Typography>        

        <Typography 
          onClick={handleKafkaClick}
          variant="h6" 
          component="div" 
          margin="10px">
            Kafka
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
