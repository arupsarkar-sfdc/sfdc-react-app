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

  // const { X509Certificate } = require("crypto");

  useEffect(() => {
    //call the server '/api/env to get the env variables using fetch
    fetch("/api/env")
      .then((response) => response.json())
      .then((data) => {
        console.log("KafkaClientenv variables", data);
        // parse the data and set it to envData interface variable
        const envData: envData = data;
        // set the envData to the state variable env
        setEnv(envData);
        //split the kafka_url having a delimiter of ',' and assign it to broker variable
        const broker = envData.kafka_url.split(",");
        //set the broker variable to the state variable broker
        setBroker(broker);
        try {
          const kafkaConfig: KafkaConfig = {
            clientId: "my-app",
            brokers: [
              broker[0].replace(/kafka\+ssl:\/\//gi, ""),
              broker[1].replace(/kafka\+ssl:\/\//gi, ""),
              broker[2].replace(/kafka\+ssl:\/\//gi, ""),
              broker[3].replace(/kafka\+ssl:\/\//gi, ""),
              broker[4].replace(/kafka\+ssl:\/\//gi, ""),
              broker[5].replace(/kafka\+ssl:\/\//gi, ""),
              broker[6].replace(/kafka\+ssl:\/\//gi, ""),
            ],
            ssl: {
              rejectUnauthorized: false,
              ca: [envData.kafka_trusted_cert],
              cert: [envData.kafka_client_cert],
              key: [envData.kafka_client_cert_key],
              // checkServerIdentity(hostname, cert) {
              //   console.log("KafkaClienthostname", hostname);
              //   console.log("KafkaClientcert", cert);
              //   //check the fingerprint
              //   if (cert.fingerprint == envData.kafka_trusted_cert.fingerprint){
              //       console.log("KafkaClientfingerprint matched");
              //       return undefined;
              //   }
              //   //otherwise return an error
              //   return new Error(`Server certificate for ${hostname} doesn't match!`);
              // },
            },
          };
          //set the kafkaConfig to the state variable kafkaConfig
          setKafkaConfig(kafkaConfig);
        } catch (error) {
          console.error("crypto error -> ", error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const submitToKafkaTopic = () => {
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
    const producer = kafka!.producer();
    await producer.connect();
    await producer.send({
      topic: "datacloud-streaming-channel",
      messages: [{ key: "key1", value: "Hello KafkaJS user!" }],
    });
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
                onClick={submitToKafkaTopic}
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
