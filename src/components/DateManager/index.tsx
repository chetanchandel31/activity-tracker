import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import DateAdapter from "@mui/lab/AdapterMoment";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { firestore } from "firebase-config/firebase";
import useAuthListener from "hooks/useAuthListener";
import useFirestore from "hooks/useFirestore";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useParams } from "react-router-dom";
import { ActivitiesList, DateSpeceficActivitiesList } from "types";
import { deleteFirestoreDoc, getDateStringFromMoment } from "utils";
import ActivityPicker from "./ActivityPicker";
import DateSpecificActivitiesList from "./DateSpeceficActivitiesList";
import { areTwoDatesSame } from "./helpers/areTwoDatesSame";
import { visitNextDate } from "./helpers/visitNextDate";
import { visitPreviousDate } from "./helpers/visitPreviousDate";

const DateManager = () => {
  // TODO: prevent user from adding activities to future dates
  const theme = useTheme();
  const [user] = useAuthListener();
  const history = useHistory();

  const { date: selectedDateString } = useParams<{ date: string }>();
  const selectedDate = moment(selectedDateString, "MM-DD-YYYY");
  const [selectedActivity, setSelectedActivity] = useState("");

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

  const isDateValid =
    selectedDate?.toDate()?.toDateString() &&
    selectedDate?.toDate()?.toDateString() !== "Invalid Date";

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
            color="text.primary"
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
                  sx={{ width: { xs: "100%", sm: 150 } }}
                />
              )}
            />
          </LocalizationProvider>

          <ActivityPicker
            activitiesList={activitiesList}
            activityMenuRef={activityMenuRef}
            dateSpecificActivitiesList={dateSpecificActivitiesList}
            selectedActivity={selectedActivity}
            selectedDate={selectedDate}
            setSelectedActivity={setSelectedActivity}
          />
        </Box>

        <Divider sx={{ m: theme.spacing(3, 0) }} />

        <DateSpecificActivitiesList
          activitiesList={activitiesList}
          activityMenuRef={activityMenuRef}
          dateSpecificActivitiesList={dateSpecificActivitiesList}
          selectedDate={selectedDate}
        />
      </Container>
    </>
  );
};

export default DateManager;
