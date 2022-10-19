
import React, {FC} from "react";
import AppBar from '@mui/material/AppBar';
import Typography from "@mui/material/Typography";

const MenuBar: FC = () => {
    return(
        <AppBar position="static">
            <Typography 
                variant="h6" 
                component="div" 
                margin="10px"
                sx={{ flexGrow: 1 }}
            >
                Query
            </Typography>
        </AppBar>
    )
}

export default MenuBar