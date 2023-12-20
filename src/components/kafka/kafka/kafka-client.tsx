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
interface envData {
  kafka_client_cert: string;
  kafka_client_cert_key: string;
  kafka_trusted_cert: any;
  kafka_url: string;
}

const KafkaClient: FC = () => {
  const { menu } = useMenuGlobalContext();
  const [env, setEnv] = useState<envData | undefined>(undefined);
  //create a state variable for a string array
  const [broker, setBroker] = useState<string[]>([]);
  //set kafkaConfig as useState variable
  const [kafkaConfig, setKafkaConfig] = useState<KafkaConfig | undefined>(
    undefined
  );
  const [kafka, setKafka] = useState<Kafka | undefined>(undefined);
  //define a array string variable
  const kafkaBroker: string[] = [];

  // const { X509Certificate } = require("crypto");

  useEffect(() => {
    //call the server '/api/env to get the env variables using fetch
    fetch("/api/kafka/startProducer")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
      })
      .catch((error) => console.error(error));

  }, []);

  const initializeKafka = () => {
    console.log("submitToKafkaTopic");
    console.log("env", env);
    //create a kafka instance with a try catch block
    try {
      console.log("kafkaConfig", kafkaConfig);
      const kafka = new Kafka(kafkaConfig!);
      setKafka(kafka);
    } catch (error) {
      console.error(error);
    }
  };

  const startProducer = async () => {
    try{
      console.log("start producer - kafka ", kafka)

      const producer = kafka!.producer();
      console.log("producer", producer);
      await producer.connect()
        .then(() => console.log("producer connected"))
        .catch((error) => console.error("producer connection error --> ", error))

      await producer.send({
        topic: "pearl-3815.datacloud-streaming-channel",
        messages: [{ key: "key1", value: "Hello KafkaJS user!" }],
      }).then(() => console.log("producer sent message"))
      .catch((error) => console.error("producer send error --> ", error))

    }catch(error){
      console.error("producer error --> ", error)
    }

  };

  const startConsumer = () => {};

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

              <Button
                onClick={initializeKafka}
                size="small"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Initialize Kafka
              </Button>
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