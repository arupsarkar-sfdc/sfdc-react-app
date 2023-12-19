import { FC } from "react"
import KafkaClient from "./kafka/kafka-client"


const KafkaHome: FC = () =>{
    console.log("KafkaHome")
    return (
        <div>
            <KafkaClient/>
        </div>
    )
}

export default KafkaHome