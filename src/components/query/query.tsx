import { Box, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, FC, useContext } from "react";
import "../../styles.css";
import Button from "../buttons/CustomButtonComponent";
// import { MenuContext, MenuContextInterface } from "../header/index"
import { useMenuGlobalContext } from "../header/context/globalmenucontext";

interface queryDate {
  data: string;
}

const Query: FC = () => {
  const [queryParams, setQueryParams] = useState<string>(
    "SELECT Name from Account LIMIT 2"
  );

  const [queryResults, setQueryResults] = useState<string>();
  const { menu } = useMenuGlobalContext();

  const handleQuery = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    console.log(e.target.value);
    setQueryParams(e.target.value.trim());
  };

  return (
    <div>
      {menu == "Query" ? (
        <div>
          <article>
            <TextField
              placeholder="SELECT Name from Account LIMIT 2"
              fullWidth
              multiline
              label="query"
              id="query"
              onChange={handleQuery}
              margin="normal"
            ></TextField>
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
                      console.log("Query fetch complete");
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
              <Box
                margin="10px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ p: 2, border: '1px dashed grey' }}                
              >
                <Typography fontSize="10px">{queryResults}</Typography>
              </Box>
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
