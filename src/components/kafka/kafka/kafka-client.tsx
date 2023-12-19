import { FC } from "react";
import { useMenuGlobalContext } from "../../header/context/globalmenucontext";
import { Kafka, KafkaConfig } from "kafkajs";


const KafkaClient: FC = () => {

    const { menu } = useMenuGlobalContext();
    // create a kafka config with TLS enabled
    const kafkaConfig: KafkaConfig = ({
        clientId: 'my-app',
        brokers: [process.env.KAFKA_URL as string],
        ssl: {
            rejectUnauthorized: false,
            ca: [process.env.KAFKA_CLIENT_CERT as string],
            cert: [process.env.KAFKA_TRUSTED_CERT as string],
            key: [process.env.KAFKA_CLIENT_CERT_KEY as string]
        }
    })

    const kafka = new Kafka(kafkaConfig)

    console.log("KafkaClient", kafka.logger)            





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