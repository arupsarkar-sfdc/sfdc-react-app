import React from "react";
import { FC, useEffect, useState } from "react";
import "./styles.css";

import Query from "./components/query/query";
import Header from "./components/header";
import { MenuGlobalContext } from "./components/header/context/globalmenucontext";
import MainHome from "./components/home";
import MainEvents from "./components/events";
import FixedBottomNavigation from "./components/footer/status/status";
import { CssBaseline } from "@mui/material";

const App: FC = () => {
  const [menu, setMenu] = useState<string>("Home");

  return (
    <MenuGlobalContext.Provider value={{ menu, setMenu }}>
      <CssBaseline />      
      <div className="center">
        <Header />
        <article>
          <MainHome />
        </article>
        <article>
          <Query />
        </article>
        <article>
          <MainEvents />
        </article>
        {/* <article>
          <FixedBottomNavigation />
        </article> */}
      </div>
    </MenuGlobalContext.Provider>
  );
};

export default App;
