import React, { FC } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { TextField } from "@mui/material";

const ChangeDataEvents: FC = () => {


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }))

    return(
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={16}>
          <Grid xs={8}>
          <TextField
            id="outlined-basic"
            label="api"
            variant="outlined"
            fullWidth
          />            
          </Grid>
          <Grid xs={8}>
          <TextField
            id="outlined-multiline-static"
            label="results"
            variant="outlined"
            fullWidth
            multiline
            inputProps={{style: {fontSize: 12}}}
          />          
          </Grid>
        </Grid>
      </Box>
    )
}


export default ChangeDataEvents