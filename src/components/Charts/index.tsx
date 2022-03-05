import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import useAuthListener from "hooks/useAuthListener";
import useFirestore from "hooks/useFirestore";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { ActivitiesList } from "types";

const LAST_7_DAYS = "last 7 days";
const THIS_WEEK = "this week";

const Charts = () => {
  const [user] = useAuthListener();

  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDuration(event.target.value);
  };

  const { docs: activitiesList }: ActivitiesList = useFirestore(
    `users/${user?.uid}/activities`
  );

  const defaultProps = {
    //TODO: check and fix warning
    options: activitiesList || [],
    getOptionLabel: (option: any) => option.name || "", // TODO: fix type
  };

  return (
    <>
      <Helmet>
        <title>Charts</title>
      </Helmet>

      <Container>
        {activitiesList?.length === 0 && <div>empty state</div>}

        {selectedActivity}

        {activitiesList && activitiesList?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ minWidth: 165 }}>
              <TextField
                select
                id="demo-simple-select"
                value={selectedDuration}
                label="Select a duration"
                onChange={handleDurationChange}
                size="small"
              >
                <MenuItem value={LAST_7_DAYS}>{LAST_7_DAYS}</MenuItem>
                <MenuItem value={THIS_WEEK}>{THIS_WEEK}</MenuItem>
              </TextField>
            </FormControl>

            <Autocomplete
              {...defaultProps}
              onInputChange={(_event, newInputValue) => {
                setSelectedActivity(newInputValue);
              }}
              id="disable-close-on-select"
              size="small"
              sx={{
                minWidth: 145,
                flexGrow: { xs: 1, sm: 0 },
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select Activity" />
              )}
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default Charts;
