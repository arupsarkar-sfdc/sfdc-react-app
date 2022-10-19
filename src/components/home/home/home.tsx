import React, { FC } from "react";
import { useMenuGlobalContext } from "../../header/context/globalmenucontext";

const Home: FC = () => {
  const { menu } = useMenuGlobalContext();

  return (
    <div>
      {menu == "Home" ? (
        <div className="center">
          <h1>Consume salesforce data using connected app.</h1>

          <p>1. Click Login - It will OAuth to Salesforce Org</p>
          <p>
            2. Query - Write a query in the box (please drag and make it big)
            SELECT NAME FROM ACCOUNT LIMIT 2{" "}
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
