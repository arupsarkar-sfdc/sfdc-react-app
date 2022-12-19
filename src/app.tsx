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
import { RecentsGlobalContext } from "./components/context/globalrecentscontext";

import { store } from "./components/store/store";
import { Provider } from "react-redux";

const App: FC = () => {
  const [menu, setMenu] = useState<string>("Home");
  const [recents, setRecents] = useState<string>("Recents");

  return (
    <Provider store={store}>
      <MenuGlobalContext.Provider value={{ menu, setMenu }}>
        <RecentsGlobalContext.Provider value={{ recents, setRecents }}>
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
            <article>
              <FixedBottomNavigation />
            </article>
          </div>
        </RecentsGlobalContext.Provider>
      </MenuGlobalContext.Provider>
    </Provider>
  );
};

export default App;
