import React, { useState, useEffect, FC } from "react";
import "../../styles.css";
import Button from "../buttons/CustomButtonComponent";

const Query: FC = () => {
  const [queryParams, setQueryParams] = useState<string>(
    "SELECT Name from Account LIMIT 2"
  );

  const [queryResults, setQueryResults] = useState<string>();

  const handleQuery = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    console.log(e.target.value);
    setQueryParams(e.target.value.trim());
  };

  return (
    <div>
      <h1> Query </h1>
      <article>
        <textarea
          name="queryText"
          aria-label="Query"
          onChange={handleQuery}
        ></textarea>
      </article>
      <div>
        <article>
          <Button
            border="100px"
            color="#66bb6a"
            height="40px"
            onClick={async () => {
              console.log("Initiating query call...");
              fetch(
                `/api/query?q=${encodeURI(
                  queryParams
                )}`,
                {
                  headers: { "Content-Type": "application/json" },
                }
              )
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
        <div>
          <h1>Results</h1>
            {queryResults}
        </div>
      </div>
    </div>
  );
};

export default Query;
