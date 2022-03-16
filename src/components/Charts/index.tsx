import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PersonChooseingImg from "assets/images/choose.svg";
import NoActivities from "assets/images/no-activities-charts.svg";
import useAuthListener from "hooks/useAuthListener";
import useFirestore from "hooks/useFirestore";
import useGraphData from "hooks/useGraphData";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { ActivitiesList } from "types";
import { doOpenCreateActivityDialogOnFirstRender } from "utils";
import Graph from "./Graph";
import {
  LAST_15_DAYS,
  LAST_30_DAYS,
  LAST_7_DAYS,
} from "./helpers/getGraphDataLastNDays";

const Charts = () => {
  const theme = useTheme();
  const history = useHistory();
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
        {activitiesList?.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <img
              alt="no-activities"
              style={{ maxWidth: "800px", width: "90%" }}
              src={NoActivities}
            />
            <Typography sx={{ my: 2 }} variant="h6">
              You currently don't have any activities to view chart for.
            </Typography>
            <Button
              onClick={() => doOpenCreateActivityDialogOnFirstRender(history)}
              sx={{ boxShadow: "none", textTransform: "none" }}
              variant="contained"
            >
              Create one from Activity Manager
            </Button>
          </Box>
        )}

        {activitiesList && activitiesList?.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: theme.spacing(2),
                mb: 5,
              }}
            >
              <FormControl
                sx={{ minWidth: 165, width: { xs: "100%", sm: "auto" } }}
              >
                <TextField
                  select
                  id="demo-simple-select"
                  value={selectedDuration}
                  label="Select a duration"
                  onChange={handleDurationChange}
                  size="small"
                >
                  <MenuItem value={LAST_7_DAYS}>{LAST_7_DAYS}</MenuItem>
                  <MenuItem value={LAST_15_DAYS}>{LAST_15_DAYS}</MenuItem>
                  <MenuItem value={LAST_30_DAYS}>{LAST_30_DAYS}</MenuItem>
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
                  minWidth: 165,
                  flexGrow: { xs: 1, sm: 0 },
                  width: { xs: "100%", sm: "auto" },
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
              <Graph
                datasetLabel={`${selectedActivity}`}
                graphName={`${selectedActivity} Line Chart`}
                graphData={graphData}
              />
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Charts;
