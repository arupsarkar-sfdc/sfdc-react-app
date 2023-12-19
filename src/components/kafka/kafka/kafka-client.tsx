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
  kafka_trusted_cert: string;
  kafka_url: string;
}

const KafkaClient: FC = () => {
  const { menu } = useMenuGlobalContext();
  const [env, setEnv] = useState<envData | undefined>(undefined);
  //set kafkaConfig as useState variable
  const [kafkaConfig, setKafkaConfig] = useState<KafkaConfig | undefined>(undefined);
  // create a kafka config with TLS enabled
  // const kafkaConfig: KafkaConfig = ({
  //     clientId: 'my-app',
  //     brokers: [process.env.KAFKA_URL as string],
  //     ssl: {
  //         rejectUnauthorized: false,
  //         ca: [process.env.KAFKA_CLIENT_CERT as string],
  //         cert: [process.env.KAFKA_TRUSTED_CERT as string],
  //         key: [process.env.KAFKA_CLIENT_CERT_KEY as string]
  //     }
  // })

  // const kafka = new Kafka(kafkaConfig)

  // console.log("KafkaClient", kafka.logger)

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
        //console log the envData
        console.log("KafkaClientenvData", envData.kafka_url);
        console.log("KafkaClientenvData", envData.kafka_client_cert);
        //create a kafkaconfig with SSL enables with kafkajs
        const kafkaConfig: KafkaConfig = {
          clientId: "my-app",
          brokers: [envData.kafka_url],
          ssl: {
            rejectUnauthorized: false,
            ca: [envData.kafka_client_cert],
            cert: [envData.kafka_trusted_cert],
            key: [envData.kafka_client_cert_key],
          },
        };
        //set the kafkaConfig to the state variable kafkaConfig
        setKafkaConfig(kafkaConfig);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const submitToKafkaTopic = () => {
    console.log("submitToKafkaTopic");
    console.log("kafkaConfig", kafkaConfig)
    console.log("env", env)
    //create a kafka instance
    if (kafkaConfig) {
        const kafka = new Kafka(kafkaConfig);
        console.log("kafka", kafka)
    }
  }

  console.log(menu);
  return (
    <div>
      {menu == "Kafka" ? (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} columns={16}>
            <Grid xs={8}>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Kafka Message Streaming
              </InputLabel>

              <Button
                onClick={submitToKafkaTopic}
                size="small"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Submit
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
