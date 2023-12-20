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
    try {
      console.log("start producer - kafka ");
      fetch("/api/kafka/startProducer")
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("producer error --> ", error);
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

  const stopConsumer = () => {
    //fetch the /api/kafka/stopConsumer endpoint
    fetch("/api/kafka/stopConsumer")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
      })
      .catch((error) => console.error(error));
  };

  const stopProducer = () => {
    //fetch the /api/kafka/stopProducer endpoint
    fetch("/api/kafka/stopProducer")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
      })
      .catch((error) => console.error(error));
  };

  const publishMessages = () => {
    //fetch the /api/kafka/publishMessages endpoint
    console.log("publish messages - start");
    console.log("publish messages - end");
    // fetch("/api/kafka/publishMessages")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("data", data);
    //   })
    //   .catch((error) => console.error(error));
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
              <Box sx={{ p: 2, border: 1, borderColor: "grey.500" }}>
                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <Button
                      onClick={startProducer}
                      size="small"
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Start Producer
                    </Button>
                  </Grid>

                  <Grid xs={6}>
                    <Button
                      onClick={stopProducer}
                      size="small"
                      variant="contained"
                      color="error"
                      sx={{ mt: 2 }}
                    >
                      Stop Producer
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid xs={12}>
                    <TextField
                      id="outlined-multiline-static"
                      label="Payload"
                      multiline
                      fullWidth
                      rows={4}
                      defaultValue="Kafka streams payload"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid xs={12}>
                    <Button
                      onClick={publishMessages}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      Publish Messages
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              

              <Box sx={{ p: 2, border: 1, borderColor: "grey.500" }}>
                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <Button
                      onClick={startConsumer}
                      size="small"
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Start Consumer
                    </Button>
                  </Grid>

                  <Grid xs={6}>
                    <Button
                      onClick={stopConsumer}
                      size="small"
                      variant="contained"
                      color="error"
                      sx={{ mt: 2 }}
                    >
                      Stop Consumer
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid xs={12}>
                    <TextField
                      id="outlined-multiline-static"
                      label="Output"
                      multiline
                      fullWidth
                      rows={4}
                      defaultValue="Kafka streams output"
                    />
                  </Grid>
                </Grid>                
              </Box>
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
