import { FC, useEffect, useState } from "react";
import { useMenuGlobalContext } from "../../header/context/globalmenucontext";
import { Kafka, KafkaConfig } from "kafkajs";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Button,
  Hidden,
  InputLabel,
  NativeSelect,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";

//create a interface data type for the env variables

const KafkaClient: FC = () => {
  const { menu } = useMenuGlobalContext();

  useEffect(() => {
    //call the server '/api/env to get the env variables using fetch
    console.log("useEffect");

  }, []);


  const startProducer = async () => {
    try{
      console.log("start producer - kafka ")
      fetch("/api/kafka/startProducer")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
      })
      .catch((error) => console.error(error));
    }catch(error){
      console.error("producer error --> ", error)
    }

  };

  const startConsumer = () => {
    //fetch the /api/kafka/startConsumer endpoint
    fetch("/api/kafka/startConsumer")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
      })
      .catch((error) => console.error(error));
  };

  console.log(menu);
  return (
    <div>
      {menu == "Kafka" ? (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} columns={16}>
            <Grid xs={8}>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Kafka Message Streaming
                {new Date().toLocaleString()}
              </InputLabel>

              {/* <Button
                onClick={initializeKafka}
                size="small"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Initialize Kafka
              </Button> */}
              <Button
                onClick={startProducer}
                size="small"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Start Producer
              </Button>
              <Button
                onClick={startConsumer}
                size="small"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Start Consumer
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default KafkaClient;