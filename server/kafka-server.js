//import kafkajs
const { Kafka } = require('kafkajs');
const express = require("express");
const app = express();


console.log("trusted url", process.env.KAFKA_URL)
console.log("client cert", process.env.KAFKA_CLIENT_CERT)
console.log("trusted cert before", process.env.KAFKA_TRUSTED_CERT)


//get the trusted cert from checkx509Certificate function
const checkx509Certificate = async () => {

  try{
    console.log("inside checkx509Certificate")
    //replace all \n with no space in process.env.KAFKA_TRUSTED_CERT
    process.env.KAFKA_TRUSTED_CERT = process.env.KAFKA_TRUSTED_CERT.replace(/\\n/gm, '\n')
    // // remove any trailing begining and end spaces from the cert
    // process.env.KAFKA_TRUSTED_CERT = process.env.KAFKA_TRUSTED_CERT.replace(/\s+/g, '');
    const { X509Certificate } = require("crypto");
    // //convert envData.kafka_trusted_cert to a buffer
    // const kafkaCertBuffer = Buffer.from(
    //   process.env.KAFKA_TRUSTED_CERT,
    //     "base64"
    // );
    const kafkaCert = new X509Certificate(process.env.KAFKA_TRUSTED_CERT);
    console.log("kafkaCert", kafkaCert.subject)
    return kafkaCert;
  }catch(error) {
    console.log("checkx509Certificate error ---> ", error)
  }


}

  
        

const startConsumer = async (req, res) => {
    try{
        const kafka = setupKafka();
        const consumer = kafka.consumer({ groupId: 'test-group' });
        await consumer.connect();
        console.log("consumer connected");
        await consumer.subscribe({ topic: 'pearl-3815.datacloud-streaming-channel', fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
              console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
              })
            },
          })
    }catch(error) {
        console.error("Error starting consumer", error)
    }
}

const stopConsumer = async () => {
    try{
        await consumer.disconnect()
        .then(() => {
            console.log("consumer disconnected");
        })
        .catch((error) => {
            console.error("Error disconnecting consumer", error);
        })
    }
    catch(error){
        console.log("Error stopping consumer", error)
    }
}
            

const startProducer = async (req, res) => {
    try{

        const kafka = setupKafka();
        console.log("start producer - kafka ", kafka)       
        const producer = kafka.producer();
        await producer.connect();
        console.log("producer connected");
        kafka.logger().info('producer connected');
        await producer.send({
            topic: 'pearl-3815.datacloud-streaming-channel',
            messages: [
              { value: 'Hello KafkaJS user!' },
            ],
          })
          .then((data) => {
            console.log("data", data);
          })
          .catch((error) => {
            console.log("error", error);
          })
  }catch(error) {
      console.error("Error starting producer", error)
  }
}

  const stopProducer = async () => {
    try{
      await producer.disconnect()
      .then(() => {
          console.log("producer disconnected");
      })
      .catch((error) => {
          console.error("Error disconnecting producer", error);
      })
    }catch(error){
      console.log("Error stopping producer", error)
    }
  }

const getKafkaBroker = async () => {
    try{
        const kafkaBroker = process.env.KAFKA_URL.split(",");
        //iterate the kafka broker array and remove any trailing spaces
        kafkaBroker.forEach((broker, index) => {
            let s = broker.trim();
            s = s.replace(/kafka\+ssl:\/\//gi, "")
            kafkaBroker[index] = s;
        })
        console.log("kafkaBroker", kafkaBroker);
        return kafkaBroker;
    }catch(error) {
        console.error("Error getting kafka broker", error)
    }
}
            
//create kafka client using .env for SSL parameters
const setupKafka = async () => {
    try{
        const kafkaTrustedCert = checkx509Certificate()
        //get the kafka broker from getKafkaBroker function, push it into a string array
        const kafkaBroker = await getKafkaBroker();
        console.log("kafkaBroker 0", kafkaBroker[0]);
        console.log("kafkaBroker 1", kafkaBroker[1]);
        console.log("kafkaBroker 2", kafkaBroker[2]);

        const herokuKafka = new Kafka({
            clientId: "my-app",
            brokers: [
              kafkaBroker[0]
            ],
            ssl: {
              // rejectUnauthorized: true,
              ca: [kafkaTrustedCert],
              cert: envData.kafka_client_cert,
              key: envData.kafka_client_cert_key,
              checkServerIdentity(hostname, cert) {
                  console.log("hostname", hostname);
                  console.log("cert", cert);
                  if(cert.fingerprint === kafkaTrustedCert.fingerprint) {
                    console.log("cert matched");
                    return undefined;
                  } else {
                    console.log("cert not matched");
                    return new Error(`Server certificate does not match trusted certificate`);
                  }
                    
              },
            },
        })
        .then(() => {
            console.log("Kafka client created");
        })
        .catch((error) => {
            console.error("Error creating kafka client", error);
        })
        return herokuKafka;



    }catch(error) {
        console.error("Error creating kafka config", error)
    }
}


//create a function and module.export it so that I can reference it in app.js
module.exports = {
  startConsumer: startConsumer,
  stopConsumer: stopConsumer,
  startProducer: startProducer,
  stopProducer: stopProducer
}