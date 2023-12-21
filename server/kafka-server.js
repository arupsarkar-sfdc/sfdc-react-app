//import kafkajs
const { Kafka, Partitioners, logLevel } = require('kafkajs');
const express = require("express");
const { Group } = require('@mui/icons-material');
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
        const kafka = await setupKafka();
        //get cluster information
        const admin = await getAdminClient();
        const clusterInfo = await admin.describeCluster();
        console.log("clusterInfo", clusterInfo);
        const topics = await admin.listTopics();
        console.log("topics", topics);
        //fetch topic metadata
        const topicMetadata = await admin.fetchTopicMetadata({ topics: ['pearl-3815.datacloud-streaming-channel'] });
        console.log("topicMetadata", topicMetadata);


        console.log("---> start consumer - kafka ", "START")
        console.log("---> defining consumers - kafka ")
        const consumers = [
          {
            Topic: 'pearl-3815.datacloud-streaming-channel',
            Group: 'gr1-'+Date.now()
          },
          {
            Topic: 'pearl-3815.streaming-channel',
            Group: 'gr2-'+Date.now()
          }
        ]
        console.log("---> looping consumers - kafka ")
        for (const consumer of consumers) {
          console.log("---> creating an instance of consumer - kafka ")
          const consumerInstance = kafka.consumer({ groupId: consumer.Group });
          console.log("---> connecting to an instance of consumer - kafka ")
          await consumerInstance.connect();
          console.log("---> subscribing to topic - kafka ")
          await consumerInstance.subscribe({ topic: consumer.Topic, fromBeginning: true });
          console.log("---> running the consumer - kafka ")
          await consumerInstance.run({
            eachMessage: async ({ topic, partition, message }) => {
              console.log({
                partition,
                offset: message.offset,
                key: message.key.toString(),
                value: message.value.toString(),
                headers: message.headers,
                timestamp: message.timestamp,
                topic: topic,
              })
            },
          })
          .then(() => {
            console.log("consumer started");
          })
          .catch((error) => {
            console.error("Error starting consumer", error);
          })
        }




        // //create a consumer with force permission on the group coordinator
        // const consumer = kafka.consumer({ groupId: 'my-app', 
        //       allowAutoTopicCreation: true, 
        //       maxBytesPerPartition: 1000000, 
        //       maxBytes: 1000000, 
        //       maxWaitTimeInMs: 1000, 
        //       minBytes: 1, 
        //       retry: { retries: 5 }, 
        //       sessionTimeout: 90000, 
        //       heartbeatInterval: 30000, 
        //       partitionAssigners: [({ cluster }) => {
        //         console.log("cluster", cluster);
        //         return async ({ topic, partitions: partitionMetadata, groupId }) => {
        //           console.log("topic", topic);
        //           console.log("partitionMetadata", partitionMetadata);
        //           console.log("groupId", groupId);
        //           return partitionMetadata.map((partition) => ({
        //             topic,
        //             partition: partition.partitionId,
        //             //offset: partitionMetadata.partitionId,
        //           }));
        //         }
        //       }
        // ]});



      // //const consumer = kafka.consumer({ groupId: 'my-app'});
      //   const consumers = [
      //     kafka.consumer({ groupId: 'gr1-'+Date.now()}),
      //     kafka.consumer({ groupId: 'gr2-'+Date.now()}),
      //     kafka.consumer({ groupId: 'gr3-'+Date.now()}),
      //     kafka.consumer({ groupId: 'gr4-'+Date.now()}),
      //     kafka.consumer({ groupId: 'gr5-'+Date.now()}),
      //     kafka.consumer({ groupId: 'gr6-'+Date.now()}),
      //     kafka.consumer({ groupId: 'gr7-'+Date.now()}),
      //     kafka.consumer({ groupId: 'gr8-'+Date.now()}),
      //   ]

      //   //connect to consumer group
      //   // await consumer.connect()
      //   // .then(() => {
      //   //   console.log("consumer connected");
      //   // })
      //   // .catch((error) => {
      //   //   console.error("Error connecting consumer", error);
      //   // })

      //   await Promise.all(consumers.map((consumer) => consumer.connect()));



      //   //Subscribe to topic
      //   // await consumer.subscribe({ topic: 'pearl-3815.datacloud-streaming-channel', fromBeginning: true });
      //   await Promise.all(consumers.map((consumer) => 
      //     consumer.subscribe({ 
      //       topic: 'pearl-3815.datacloud-streaming-channel', 
      //       fromBeginning: true 
      //     })));

      //   // run the consumer
      //   await Promise.all(consumers.map((consumer) => 
      //     consumer.run({
      //       eachMessage: async ({ topic, partition, message }) => {
      //         console.log({
      //           partition,
      //           offset: message.offset,
      //           key: message.key.toString(),
      //           value: message.value.toString(),
      //           headers: message.headers,
      //           timestamp: message.timestamp,
      //           topic: topic,
      //         })
      //       },
      //     })));


    }catch(error) {
        console.error("Error starting consumer", error)
    }
}

const stopConsumer = async () => {
    try{
        const kafka = await setupKafka();
        const consumer = kafka.consumer({ groupId: 'my-app' });
        if(consumer != undefined){
          await consumer.disconnect()
          .then(() => {
            console.log("consumer disconnected");
          })
          .catch((error) => {
            console.error("Error disconnecting consumer", error);
          })
          console.log("consumer stopped");
        }
        

    }
    catch(error){
        console.log("Error stopping consumer", error)
    }
}
            

const startProducer = async (req, res) => {
    try{

        const kafka = await setupKafka();
        console.log("start producer - kafka ", kafka)       
        const producer = await kafka.producer({createPartitioner: Partitioners.LegacyPartitioner});
        await producer.connect();
        console.log("producer connected");
        kafka.logger().info('producer connected');
        await producer.send({
            topic: 'pearl-3815.datacloud-streaming-channel',
            messages: [
              //attach a todays date with locale to the message
              { key: new Date().toLocaleString(), value: new Date().toLocaleString() + ' Hello KafkaJS user!' },
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

  const getAdminClient = async () => {
    try{
      const kafka = await setupKafka();
      const admin = kafka.admin();
      await admin.connect();
      console.log("admin connected");
      return admin;
    }catch(error) {
      console.error("Error creating admin client", error)
    }

  }
  const stopProducer = async () => {
    try{
      //create an instance of the producer
      const kafka = await setupKafka();
      const producer = await kafka.producer({createPartitioner: Partitioners.LegacyPartitioner});
      //disconnect the producer
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
        // console.log("kafkaBroker 1", kafkaBroker[1]);
        // console.log("kafkaBroker 2", kafkaBroker[2]);
        // console.log("kafkaBroker 3", kafkaBroker[3]);
        // console.log("kafkaBroker 4", kafkaBroker[4]);
        // console.log("kafkaBroker 5", kafkaBroker[5]);
        // console.log("kafkaBroker 6", kafkaBroker[6]);        
        // console.log("kafkaBroker 7", kafkaBroker[7]);        

        const herokuKafka = new Kafka({
            clientId: "my-app",
            // consumerGroupId: "my-app",
            // consumer: {
            //   groupId: 'my-app',
            //   sessionTimeout: 90000,
            //   heartbeatInterval: 30000,
            // },
            brokers: [
              kafkaBroker[0],
              // kafkaBroker[1],
              // kafkaBroker[2],
              // kafkaBroker[3],
              // kafkaBroker[4],
              // kafkaBroker[5],
              // kafkaBroker[6],
              // kafkaBroker[7], 
            ],
            retry: {
              initialRetryTime: 100,
              retries: 8
            },
            ssl: {
              rejectUnauthorized: false,
              //ca: kafkaTrustedCert,
              ca: process.env.KAFKA_TRUSTED_CERT,
              cert: process.env.KAFKA_CLIENT_CERT,
              key: process.env.KAFKA_CLIENT_CERT_KEY,
              // checkServerIdentity(hostname, cert) {
              //     console.log("hostname", hostname);
              //     console.log("cert", cert);
              //     if(cert.fingerprint === kafkaTrustedCert.fingerprint) {
              //       console.log("cert matched");
              //       return undefined;
              //     } else {
              //       console.log("cert not matched");
              //       return new Error(`Server certificate does not match trusted certificate`);
              //     }
                    
              // },
            },
            restartOnFailure: async (error) => {
              console.error("Error connecting to kafka", error)
              return true;
            },
            logLevel: logLevel.DEBUG,
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