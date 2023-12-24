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

//create a interface data type for a simple message payload
interface Message {
  msg: string;
}


const KafkaClient: FC = () => {
  const { menu } = useMenuGlobalContext();
  const [data, setData] = useState<Message>();
  const [msg, setMsg] = useState<Message>({msg: ""}); 

  useEffect(() => {
    //call the server '/api/env to get the env variables using fetch
  }, []);

  // const startProducer = async () => {
  //   try {
  //     console.log("start producer - kafka ");
  //     const response = await fetch("/api/kafka/startProducer", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({msg}),
  //     });
  //     const data = await response.json();
  //     console.log("data", data);


  //     // fetch("/api/kafka/startProducer")
  //     //   .then((res) => res.json())
  //     //   .then((data) => {
  //     //     console.log("data", data);
  //     //   })
  //     //   .catch((error) => console.error(error));
  //   } catch (error) {
  //     console.error("producer error --> ", error);
  //   }
  // };

  // const startConsumer = () => {
  //   //fetch the /api/kafka/startConsumer endpoint
  //   fetch("/api/kafka/startConsumer")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("data", data);
  //     })
  //     .catch((error) => console.error(error));
  // };

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

  const publishMessages = async () => {
    //parse the json payload
    const payload = JSON.stringify(msg);
    //fetch the /api/kafka/publishMessages endpoint
    console.log("publish messages - start", JSON.stringify(msg));
    //create a JSON with the message payload
    fetch(`/api/kafka/startProducer?payload=${payload}`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          console.log("Raw response : ", JSON.stringify(res));
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        console.log("Publish message submitted response : ", JSON.stringify(data));
        // data.replace(/\\/g, "")
        // setData(JSON.stringify(data).replace(/\\/g, ""));
        //also format it with indentation
        //setData(data.toString());

      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        console.log("Published messages complete");
      });
    console.log("data", data);    
    console.log("publish messages - end");

  };

  const fetchMessages = () => {
    //fetch the /api/kafka/fetchMessages endpoint
    console.log("fetch messages - start");
    eventsListener();
    console.log("fetch messages - end");

  };

  const eventsListener = () => {
    try {
      const source = new EventSource(`/api/kafka/events`);
      source.addEventListener(
        "open",
        () => {
          console.log("Events stream opened!");
        },
        false
      );

      source.addEventListener(
        "message",
        (e: any) => {
          console.log("Events payload received ", e.data);
          //const value = e.data;
          //remove all backslashes from the string
          // value.replace(/\\/g, "");
          //also make the json formatted with indentation
                    

          // let data =[];
          // //data.push(e.data);
          // data.push(JSON.stringify(value, null, 2));
          // console.log("Events payload received ", e.data.toString().replace(/\\/g, ""));
          //setData((data) => [...data, value]);
          //setData(JSON.parse(e.data.toString().replace(/\\/g, "")));
          setData(e.data)
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
      console.error("Error in platform event : ", error);
    }
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
                    {/* <Button
                      onClick={startProducer}
                      size="small"
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Start Producer
                    </Button> */}
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
                      onChange={(e) => {
                        e.preventDefault();
                        console.log("e.target.value", e.target.value);
                        setMsg({msg: e.target.value});
                      }}
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
                    {/* <Button
                      onClick={startConsumer}
                      size="small"
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Start Consumer
                    </Button> */}
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
                      value={data}
                    />
                  </Grid>
                </Grid>                
                <Grid container spacing={1}>
                  <Grid xs={12}>
                    <Button
                      onClick={fetchMessages}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      Fetch Messages
                    </Button>
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
