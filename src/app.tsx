import React from "react";
import { FC, useEffect, useState } from "react";
import "./styles.css";

import Query from "./components/query/query";
import Login from "./components/auth/login";
import Logout from "./components/auth/logout";
import Header from "./components/header";



const App: FC = () => {



  return (
    <div className="center">
      <Header/>
      <h1>Consume salesforce data using connected app.</h1>
      
      <p>1. Click Login - It will OAuth to Salesforce Org</p>
      <p>2. Query - Write a query in the box (please drag and make it big) SELECT NAME FROM ACCOUNT LIMIT 2 </p>
      <p>3. Click Logout - It will destroy the OAuth session</p>
      {/* <article>
        <Login/>
      </article> */}
      <article>
          <Query/>
      </article>
      {/* <article>
        <Logout/>
      </article> */}
    </div>
  );
};

export default App;
