import React from "react";
import { FC, useEffect, useState } from "react";
import "./styles.css";

import Query from "./components/query/query";
import Header from "./components/header";
import { MenuGlobalContext } from "./components/header/context/globalmenucontext";
import MainHome from "./components/home";

const App: FC = () => {
  const [menu, setMenu] = useState<string>("Home");

  return (
    <MenuGlobalContext.Provider value={{ menu, setMenu }}>
      <div className="center">
        <Header />
        <article>
          <MainHome/>
        </article>
        <article>
          <Query />
        </article>
      </div>
    </MenuGlobalContext.Provider>
  );
};

export default App;
