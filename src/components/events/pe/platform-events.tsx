import React, { FC, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { Button, TextField } from "@mui/material";

const PlatformEvents: FC = () => {
  const [queryResults, setQueryResults] = useState<string>();
  const [evtParam, setEvtParam] = useState<string>("No Event");
  const [evtPayload, setEvtPayload] = useState<string>('')

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  //capture platform event body to subscribe and publish
  const handleEventPayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setEvtPayload(e.target.value.trim())
  }

  //capture platform event name to subscribe and publish
  const handleEventNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    console.log(`Event param ${e.target.value}`);
    setEvtParam(e.target.value.trim());
  };

  const handleEventClick = () => {
    console.log(`Event param to be tracked ${evtParam} Started`);
    fetch(`/api/event?eventParam=${encodeURI(evtParam)}&eventBody=${encodeURI(evtPayload)}`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          console.log("Raw response : ", JSON.stringify(res));
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        console.log("Event submitted response : ", JSON.stringify(data));
        setQueryResults(JSON.stringify(data));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        console.log("Events fetch complete");
        eventsListener();
      });
    console.log(`Event param to be tracked ${evtParam} End`);
  };

  const eventsListener = () => {
    try {
      const source = new EventSource(`/api/events`);
      source.addEventListener(
        "open",
        () => {
          console.log("Events stream opened!");
        },
        false
      );

      source.addEventListener(
        "message",
        (e: any) => {
          console.log("Events payload received ", e.data);
          setQueryResults(e.data)
        },
        false
      );

      source.addEventListener(
        "error",
        (e) => {
          console.error("Error: ", e);
        },
        false
      );
      return () => {
        source.close();
      };
    } catch (error) {
      console.error("Error in platform event : ", error);
    }
  };

  useEffect(() => {
    //eventsListener();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16}>
        <Grid xs={8}>
          {/* <Item>Paste your PE JSON here...</Item> */}
          <TextField
            id="outlined-basic"
            label="api"
            variant="outlined"
            fullWidth
            onChange={handleEventNameChange}
          />
          <TextField
            margin="normal"
            id="outlined-multiline-static"
            label="json"
            fullWidth
            multiline
            onChange={handleEventPayloadChange}
          />
        </Grid>
        <Grid xs={8}>
          {/* <Item>PE: Response from salesforce server...</Item> */}
          <TextField
            id="outlined-multiline-static"
            label="results"
            variant="outlined"
            fullWidth
            multiline
            inputProps={{style: {fontSize: 12}}}
            value={queryResults}
          />
        </Grid>

        <Button onClick={handleEventClick} size="small" variant="contained">
          Submit
        </Button>
      </Grid>
    </Box>
  );
};

export default PlatformEvents;
