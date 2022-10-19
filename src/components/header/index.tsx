import React, {FC} from "react";
import Authenticate from "./auth/authenticate";
import MenuBar from "./topbar/menu";

const Header: FC = () => {

    return(
        <div>
            <Authenticate/>
            <MenuBar/>
        </div>

    )
}

export default Header;