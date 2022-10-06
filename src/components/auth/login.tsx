import React, { FC, useState, useEffect } from "react";
import Button from "../buttons/CustomButtonComponent";
import "../../styles.css";

interface ICRMData {
  id?: string;
  issued_at?: string;
  instance_url?: string;
  signature?: string;
  access_token: string;
}

interface token_received {
    token_received?: boolean;
  }

const defaultCRMData: ICRMData[] = [];

const Login: FC = () => {
  const login = () => {
    console.log("Login initiated ....", "Start");
    window.location.href = "/auth/login";
  };

  const [data, setData] = useState<ICRMData[]>(defaultCRMData);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isLoggedIn, setLoggedIn] = useState<token_received | false >(false);
  const [showLogin, setShowLogin] = useState<boolean>(false)

    // useEffect(() => {
    //     try{
    //         fetch('http://localhost:3000/auth/token')
    //             .then((res) =>{
    //                 if (res.ok) {
    //                     console.log("Raw response : ", JSON.stringify(res));
    //                     return res.json()
    //                   }
    //                   throw res;
    //             })
    //             .then((data: token_received) => {
    //                 console.log(data.token_received)
    //                 setLoggedIn(data)
    //                 if(data.token_received) {
    //                     setShowLogin(true)
    //                 }
                    
    //             })
    //             .catch((error) => {
    //                 console.error('Error fetch data from server ', error)
    //             })
    //             .finally(() => {
    //                 console.log('Fetched data from server')
    //             })
    //     }catch(err){
    //         console.error('Error fetching tokens.')
    //     }
    // }, [isLoggedIn])

  return (
    <div>
      <Button
        border="100px"
        color="#03a9f4"
        height="40px"
        onClick={async () => {
          console.log("Initiating Server call...");
          login();
        }}
        radius="5%"
        width="100px"
        children="Login"
      />
    </div>
  );
};

export default Login;
