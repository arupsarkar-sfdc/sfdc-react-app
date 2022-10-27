import React, { FC, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Button,
  Hidden,
  InputLabel,
  NativeSelect,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";

const ChangeDataEvents: FC = () => {
  const [evtParam, setEvtParam] = useState<string>("");
  const [queryResults, setQueryResults] = useState<string>();
  const [showApi, setShowApi] = useState<boolean>(false);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const handleChangeApiName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setEvtParam(e.target.value.trim());
  };

  const handleChange = (e: string) => {
    console.log(`CDC Selected ${e}`);
    if (e == "10") {
      setShowApi(true);
      // track all CDC events
      setEvtParam("ChangeEvents");
    } else if (e == "20") {
      setShowApi(false);
    }
  };
  const handleChangeEventClick = () => {
    console.log(evtParam);
    fetch(`/api/change/event?changeEventName=${encodeURI(evtParam)}`, {
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
          setQueryResults(e.data);
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16}>
        <Grid xs={8}>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Track All Events
          </InputLabel>
          <NativeSelect
            defaultValue={20}
            inputProps={{
              name: "cdc",
              id: "uncontrolled-native",
            }}
            onChange={(event) => {
              handleChange(event.target.value as string);
            }}
          >
            <option value={10}>Yes</option>
            <option value={20}>No</option>
          </NativeSelect>

          <Tooltip title="api name of cdc. Standard Object: AccountChangeEvent, Custom Object: Employee__ChangeEvent">
            <TextField
              disabled={showApi}
              margin="normal"
              id="outlined-basic"
              label="api"
              variant="outlined"
              fullWidth
              onChange={handleChangeApiName}
            />
          </Tooltip>

          <Button
            onClick={handleChangeEventClick}
            size="small"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Grid>
        <Grid xs={8}>
          <Tooltip title="Results of CDC events will pop up here">
            <TextField
              id="outlined-multiline-static"
              variant="outlined"
              fullWidth
              multiline
              value={queryResults}
              inputProps={{ style: { fontSize: 12 } }}
            />
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangeDataEvents;
