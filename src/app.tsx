import React from "react";
import { FC, useEffect, useState } from "react";
import "./styles.css";

import Button from "./components/buttons/CustomButtonComponent";
import Query from "./components/query/query";

interface ICRMData {
  id?: string;
  issued_at?: string;
  instance_url?: string;
  signature?: string;
  access_token: string;
}

const defaultCRMData: ICRMData[] = []

const App: FC = () => {

  const [data, setData] = useState<ICRMData[]>(defaultCRMData)  
  const [token, setToken] = useState<string | undefined>(undefined)
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false)


  const login = () => {
    console.log('Login initiated ....', 'Start')
    window.location.href = '/auth/login'
  }

  return (
    <div>
      <h1>Resize the browser window to see the effect!</h1>
      <p className="header1">
          Salesforce 
        <Button
          border="100px"
          color="#03a9f4"
          height="40px"
          onClick={async () => {
            console.log("Initiating Server call...")
            login()
            
            // fetch('http://localhost:3000/auth/login', {
            //   headers: {"Content-Type": "application/json"}
            // })
            //   .then(res => {
            //     if(res.ok) {
            //       console.log('Raw response : ', JSON.stringify(res))
            //       return res.json()
            //     }
            //     throw res

            //   })
            //   .then(payload => {
            //     console.log('Data response : ', JSON.stringify(payload))
            //     const entities = payload as ICRMData[]
            //     console.log('token data : ', entities)
            //     const identityTokenData: ICRMData[] = []
            //     payload.map((data: ICRMData) => {
            //       identityTokenData.push(data as ICRMData)
            //     })

            //     setToken(identityTokenData[0].access_token)
            //     setData(identityTokenData)
            //     console.log('_crmData : ', identityTokenData[0].access_token)
            //     if(identityTokenData[0].access_token) {
            //       setLoggedIn(true)
            //     }
            //   })
            //   .catch(err => {
            //     console.error('Error fetching data : ', err)
            //   })
            //   .finally(() => {
            //     console.log('Fetch complete...')
            //     console.log('data : ', token)
            //   })
            

          }}
          radius="5%"
          width="100px"
          children="Login"
        />
      </p>

      <article>
        <h3>Salesforce </h3>
          <Query/>
      </article>
    </div>
  );
};

export default App;
