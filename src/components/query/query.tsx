import { Box, TextField, Tooltip, Typography } from "@mui/material";
import React, { useState, useEffect, FC, useContext } from "react";
import "../../styles.css";
import Button from "../buttons/CustomButtonComponent";
// import { MenuContext, MenuContextInterface } from "../header/index"
import { useMenuGlobalContext } from "../header/context/globalmenucontext";
import { useRecentsGlobalContext } from "../context/globalrecentscontext";

import { useDispatch } from "react-redux";
import { querySlice } from "../store/querySlice";

interface queryDate {
  data: string;
}

const Query: FC = () => {

  const dispatch = useDispatch();
  const [body, setBody] = useState("")

  const [queryParams, setQueryParams] = useState<string>(
    "SELECT Name from Account LIMIT 2"
  );

  const [queryResults, setQueryResults] = useState<string>();
  const { menu } = useMenuGlobalContext();
  const { recents, setRecents } = useRecentsGlobalContext() 

  const handleQuery = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    console.log(e.target.value);
    setBody(e.target.value.trim())
    setQueryParams(e.target.value.trim());
  };

  return (
    <div>
      {menu == "Query" ? (
        <div>
          <article>
          <Tooltip title="SOQL: select firstname, lastname from contact order by lastname, firstname limit 10">
          <TextField
              placeholder="SELECT Name from Account LIMIT 2"
              fullWidth
              multiline
              label="query"
              id="query"
              onChange={
                handleQuery
              }
              margin="normal"
            ></TextField>            
          </Tooltip>

          </article>
          <div>
            <article>
              <Button
                border="100px"
                color="#66bb6a"
                height="40px"
                onClick={async () => {
                  console.log("Initiating query call...");
                  fetch(`/api/query?q=${encodeURI(queryParams)}`, {
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
                      console.log("Data response : ", JSON.stringify(data));
                      setQueryResults(JSON.stringify(data));
                    })
                    .catch((error) => {
                      console.error(error);
                    })
                    .finally(() => {
                      console.log("Query fetch complete : ", body);
                      setRecents(queryParams)  
                      dispatch(querySlice.actions.addQuery({body}))    
                      setBody("")                
                    });
                }}
                radius="5%"
                width="100px"
                children="Submit"
              />
            </article>
            <Box
              style={{
                overflowY: "auto",
                maxHeight: "180px",
                display: "flex",
                flexGrow: 1,
                flexDirection: "column",
              }}
            >

              <Tooltip title="Results of SOQL will be visible here">
                <TextField
                  id="outlined-multiline-static"
                  label="results"
                  variant="outlined"
                  fullWidth
                  multiline
                  inputProps={{ style: { fontSize: 12 } }}
                  value={queryResults}
                  margin="normal"
                />
              </Tooltip>
            </Box>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Query;
