import AddRoundedIcon from "@mui/icons-material/AddRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import DateAdapter from "@mui/lab/AdapterMoment";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import { firestore } from "firebase-config/firebase";
import useAuthListener from "hooks/useAuthListener";
import useFirestore from "hooks/useFirestore";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useParams } from "react-router-dom";
import { ActivitiesList, DateSpeceficActivitiesList, Timestamp } from "types";
import {
  deleteFirestoreDoc,
  editFirestoreDoc,
  findActivityById,
  getDateStringFromMoment,
} from "utils";
import DateSpecificActivitiesList from "./DateSpeceficActivitiesList";
import { addActivityToDate } from "./helpers/addActivityToDate";
import { areTwoDatesSame } from "./helpers/areTwoDatesSame";
import { doDisableActivityBtn } from "./helpers/doDisableActivityBtn";
import { getFilteredTimestampsArr } from "./helpers/getFilteredTimestampsArr";
import { visitNextDate } from "./helpers/visitNextDate";
import { visitPreviousDate } from "./helpers/visitPreviousDate";

const DateManager = () => {
  // TODO: prevent user from adding activities to future dates
  // TODO: create new activity right from here, mui autocomplete > createable. use same dialog component
  // TODO: seperate out helper functions? currently can't copy paste/reuse
  const theme = useTheme();
  const [user] = useAuthListener();
  const history = useHistory();
  const { date: selectedDateString } = useParams<{ date: string }>();

  const selectedDate = moment(selectedDateString);
  const [selectedActivity, setSelectedActivity] = useState("");

  const activitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/activities`
  );
  const dateSpecificActivitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/dates/${selectedDateString}/date-specific-activities`
  );

  const { docs: activitiesList }: ActivitiesList = useFirestore(
    `users/${user?.uid}/activities`
  );
  const { docs: dateSpecificActivitiesList }: DateSpeceficActivitiesList =
    useFirestore(
      `users/${user?.uid}/dates/${selectedDateString}/date-specific-activities`
    );

  useEffect(() => {
    dateSpecificActivitiesList?.forEach((el) => {
      const isActivityFoundInActivitiesCollection = activitiesList?.find(
        (activity) => activity.id === el.activityId
      );

      if (!isActivityFoundInActivitiesCollection)
        deleteFirestoreDoc(dateSpecificActivitiesCollectionRef, el.activityId);
    });
  });

  const isSelectedDateSameAsCurrentDate = areTwoDatesSame(
    selectedDate,
    moment()
  );

  //whenever frequency gets updated in any way, two places have to be updated:
  // 1. performedAt in "activities" collection 2. performedAt in "date-specific-activities" collection

  const deleteActivityFromDate = (
    activityId: string,
    dateSpecificActivitiesPerformedAtArr: Timestamp[]
  ) => {
    // activities-collection
    const activity = findActivityById(activitiesList, activityId);
    if (!activity) return;
    const activitiesCollectionPerformedAtArr = activity.performedAt;

    editFirestoreDoc({
      collectionRef: activitiesCollectionRef,
      docId: activityId,
      updatedDoc: {
        performedAt: getFilteredTimestampsArr(
          activitiesCollectionPerformedAtArr,
          dateSpecificActivitiesPerformedAtArr
        ),
      },
    });

    // date-specific-activities-collection
    deleteFirestoreDoc(dateSpecificActivitiesCollectionRef, activityId);
  };

  const isAddActivityBtnDisabled = doDisableActivityBtn({
    activitiesList,
    dateSpecificActivitiesList,
    selectedActivity,
  });

  const isDateValid =
    selectedDate?.toDate()?.toDateString() &&
    selectedDate?.toDate()?.toDateString() !== "Invalid Date";

  const defaultProps = {
    //TODO: check and fix warning
    options: activitiesList || [],
    getOptionLabel: (option: any) => option.name || "", // TODO: fix type
  };

  const activityMenuRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Helmet>
        <title>Date Manager</title>
      </Helmet>

      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            size="small"
            onClick={() => visitPreviousDate(selectedDate, history)}
          >
            <NavigateBeforeRoundedIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              ...(!isDateValid ? { color: theme.palette.error.main } : {}),
            }}
          >
            {selectedDate?.toDate()?.toDateString() || "Invalid Date"}
          </Typography>
          <IconButton
            size="small"
            onClick={() => visitNextDate(selectedDate, history)}
            disabled={isSelectedDateSameAsCurrentDate}
          >
            <NavigateNextRoundedIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            mt: theme.spacing(4),
            alignItems: "flex-start",
            gap: theme.spacing(2),
          }}
        >
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(value) => {
                if (value !== null)
                  history.push(
                    `/date-manager/${getDateStringFromMoment(value)}`
                  );
              }}
              disableFuture
              renderInput={(params) => (
                <TextField
                  size="small"
                  {...params}
                  error={
                    selectedDate?.toDate()?.toDateString() === "Invalid Date" ||
                    !selectedDate
                  }
                  // helperText={params?.inputProps?.placeholder}
                  sx={{ width: { xs: "100%", sm: 150 } }}
                />
              )}
            />
            {/* <TextField size="small" error={false} /> */}
          </LocalizationProvider>

          <Box
            sx={{
              display: "flex",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Autocomplete
              {...defaultProps}
              // value={selectedActivity}
              onInputChange={(event, newInputValue) => {
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
                  // helperText="ok"
                  // color="warning"
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
              title={
                isAddActivityBtnDisabled
                  ? ""
                  : `Add "${selectedActivity}" to ${selectedDate.format("LL")}`
              }
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
                    addActivityToDate({
                      activitiesList,
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
        </Box>

        <Divider sx={{ m: theme.spacing(3, 0) }} />

        <DateSpecificActivitiesList
          activitiesList={activitiesList}
          activityMenuRef={activityMenuRef}
          dateSpecificActivitiesList={dateSpecificActivitiesList}
          deleteActivityFromDate={deleteActivityFromDate}
          selectedDate={selectedDate}
        />
      </Container>
    </>
  );
};

export default DateManager;
