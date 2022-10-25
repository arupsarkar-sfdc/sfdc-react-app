import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { FC } from "react";
import { useMenuGlobalContext } from "../header/context/globalmenucontext";
import ChangeDataEvents from "./cdc/change-data-events";
import PlatformEvents from "./pe/platform-events";

const MainEvents: FC = () => {
  const { menu } = useMenuGlobalContext();

  const [selectedValue, setSelectedValue] = React.useState("a");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  return (
    <div>
      {menu == "Events" ? (
        <div>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Select Event Type
            </FormLabel>
            <RadioGroup row name="position" defaultValue="Platform Events">
              <FormControlLabel
                value="start"
                control={<Radio {...controlProps("a")} color="secondary" />}
                label="Platform Events"
                labelPlacement="end"
              ></FormControlLabel>

              <FormControlLabel
                value="start"
                control={<Radio {...controlProps("b")} color="success" />}
                label="Changed Data Events"
                labelPlacement="end"
              ></FormControlLabel>
            </RadioGroup>
          </FormControl>

          <div>
            {selectedValue == "a" ? (
              <div>
                <PlatformEvents />
              </div>
            ) : (
              <div>
                <ChangeDataEvents />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {/* <div>
        {selectedValue == "a" ? (
          <div>
            <PlatformEvents />
          </div>
        ) : (
          <div>
            <ChangeDataEvents />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default MainEvents;
