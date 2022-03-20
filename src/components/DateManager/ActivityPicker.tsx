import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import useAuthListener from "hooks/useAuthListener";
import { Moment } from "moment";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { Activity, DateSpeceficActivity } from "types";
import { addActivity } from "./helpers/addActivity";
import { isSelectedActivityAlreadyAdded } from "./helpers/isSelectedActivityAlreadyAdded";
import RedirectDialog from "./RedirectDialog";

interface ActivityPickerProps {
  activitiesList: Activity[] | null;
  activityMenuRef: RefObject<HTMLDivElement>;
  dateSpecificActivitiesList: DateSpeceficActivity[] | null;
  selectedActivity: string;
  selectedDate: Moment;
  setSelectedActivity: Dispatch<SetStateAction<string>>;
}

const ActivityPicker = (props: ActivityPickerProps) => {
  const {
    activitiesList,
    activityMenuRef,
    dateSpecificActivitiesList,
    selectedActivity,
    selectedDate,
    setSelectedActivity,
  } = props;

  const [user] = useAuthListener();

  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);

  const isSelectedActivityAlreadyAddedToSelectedDate =
    isSelectedActivityAlreadyAdded({
      activitiesList,
      dateSpecificActivitiesList,
      selectedActivity,
    });

  const isAddActivityBtnDisabled =
    isSelectedActivityAlreadyAddedToSelectedDate || !selectedActivity;

  const tooltipTitle = isSelectedActivityAlreadyAddedToSelectedDate
    ? `"${selectedActivity}" is already added to ${selectedDate.format("LL")}`
    : selectedActivity
    ? `Add "${selectedActivity}" to ${selectedDate.format("LL")}`
    : "";

  const defaultProps = {
    //TODO: check and fix warning
    options: activitiesList || [],
    getOptionLabel: (option: any) => option.name || "", // TODO: fix type
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Autocomplete
          {...defaultProps}
          // value={selectedActivity}
          freeSolo
          onInputChange={(_event, newInputValue) => {
            setSelectedActivity(newInputValue);
          }}
          size="small"
          sx={{
            minWidth: 145,
            flexGrow: { xs: 1, sm: 0 },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Activity"
              ref={activityMenuRef}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "4px 0 0 4px",
                },
              }}
            />
          )}
        />

        <Tooltip
          disableInteractive
          TransitionComponent={Zoom}
          title={tooltipTitle}
        >
          <span>
            <Button
              variant="contained"
              size="small"
              sx={{
                boxShadow: "none",
                textTransform: "none",
                height: "40px",
                minWidth: "40px",
                maxWidth: "40px",
                borderRadius: "0 4px 4px 0",
              }}
              disabled={isAddActivityBtnDisabled}
              onClick={() =>
                addActivity({
                  activitiesList,
                  openRedirectDialog: () => setIsRedirectDialogOpen(true),
                  selectedActivity,
                  selectedDate,
                  user,
                })
              }
            >
              <AddRoundedIcon />
            </Button>
          </span>
        </Tooltip>
      </Box>

      <RedirectDialog
        open={isRedirectDialogOpen}
        handleClose={() => setIsRedirectDialogOpen(false)}
        selectedActivity={selectedActivity}
      />
    </>
  );
};

export default ActivityPicker;
