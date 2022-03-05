import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PersonChooseingImg from "assets/images/choose.svg";
import useAuthListener from "hooks/useAuthListener";
import useFirestore from "hooks/useFirestore";
import useGraphData from "hooks/useGraphData";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { ActivitiesList } from "types";
import Graph from "./Graph";

export const LAST_7_DAYS = "last 7 days";
export const THIS_WEEK = "this week";

// TODO: test scenario when 0 activities
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

  const { graphData, graphDataError, isGraphDataLoading } = useGraphData({
    activitiesList,
    selectedActivity,
    selectedDuration,
  });

  const isLoading = activitiesList === null;

  if (isLoading)
    return (
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress sx={{ mt: 5 }} />
      </Box>
    );

  return (
    <>
      <Helmet>
        <title>Charts</title>
      </Helmet>

      <Container>
        {/* when 0 activities */}
        {activitiesList?.length === 0 && <div>empty state</div>}

        {activitiesList && activitiesList?.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 5,
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

            {graphDataError && (
              <Box sx={{ textAlign: "center" }}>
                <img
                  alt="person selecting choices"
                  src={PersonChooseingImg}
                  style={{ maxWidth: "400px", width: "90%" }}
                />
                <Typography sx={{ mt: 2 }} variant="h6">
                  {graphDataError}
                </Typography>
              </Box>
            )}
            {isGraphDataLoading && (
              <Box sx={{ textAlign: "center", mt: 15 }}>
                <CircularProgress />
              </Box>
            )}
            {!graphDataError && !isGraphDataLoading && (
              <Graph graphData={graphData} />
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Charts;
