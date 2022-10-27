import { Typography } from "@mui/material";
import React, { FC } from "react";
import { useMenuGlobalContext } from "../../header/context/globalmenucontext";

const Home: FC = () => {
  const { menu } = useMenuGlobalContext();

  return (
    <div>
      {menu == "Home" ? (
        <div className="center">
          <h1 >Consume salesforce data using connected app.</h1>

          <p>1. Click Login - It will OAuth to Salesforce Org</p>
          <p>
            2. Query - Write a query in the box. Example: SELECT id, name FROM
            ACCOUNT LIMIT 2
          </p>
          <p>
            3. Events - Track Platform Events and Change Data Capture. 
            
            <p>
            a)
            Platform Events (PE): Put in the api name, click submit to track i)
            Additionally, you can put JSON payload of the PE and click submit
            </p>
            <p>
            b) Change Data Capture: Track change data capture i) Select "Yes" to
            capture all CDC ii)Select "No", specify a api name of CDC to track.
            </p>

            <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
              [PLEASE DO NOT FORGET TO CLICK SUBMIT]
            </Typography>
          </p>
          <p>3. Click Logout - It will destroy the OAuth session</p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Home;
