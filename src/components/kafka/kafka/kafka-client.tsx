import { FC, useEffect, useState } from "react";
import { useMenuGlobalContext } from "../../header/context/globalmenucontext";
import { Kafka, KafkaConfig } from "kafkajs";


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
        fetch('/api/env')
            .then(response => response.json())
            .then(data => {
                console.log("KafkaClientenv variables", data)
                // parse the data and set it to envData interface variable
                const envData: envData = data
                // set the envData to the state variable env
                setEnv(envData)
                //console log the envData
                console.log("KafkaClientenvData", envData.kafka_url)
                console.log("KafkaClientenvData", envData.kafka_client_cert)

            })
            .catch(error => {
                console.error(error)
            })
    },[])



    console.log(menu)
    return (
        <div>
            {menu == "Kafka" ? (
                <div className="center">
                    <h1>Kafka</h1>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )

}

export default KafkaClient;

    