import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import DateAdapter from "@mui/lab/AdapterMoment";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Autocomplete, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { useEffect, useState } from "react";
import { firestore } from "../../firebase/firebase";
import useAuthListener from "../../hooks/useAuthListener";
import useFirestore from "../../hooks/useFirestore";
// import useFirestoreDoc from "../../hooks/useFirestoreDoc";
import { v4 as uuidv4 } from "uuid";

const DateManager = () => {
  //todo: tooltip for add button
  //todo: can add debounce for counters in frequency
  // todo: prevent user from adding activities to future dates
  // TODO: create new activity right from here, mui autocomplete > createable. use same dialog component
  // seperate out helper functions? currently can't copy paste/reuse
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedActivity, setSelectedActivity] = useState("");

  const [user] = useAuthListener();
  const { docs: activitiesList } = useFirestore(`users/${user.uid}/activities`);
  const activitiesCollectionRef = firestore.collection(
    `users/${user.uid}/activities`
  );
  const dateSpecificActivitiesCollectionRef = firestore.collection(
    `users/${user.uid}/dates/${selectedDate
      .toDate()
      .toLocaleDateString()
      .replaceAll("/", "-")}/date-specific-activities`
  );

  // const { doc: selectedDateActivitiesList } = useFirestoreDoc(
  //   `users/${user.uid}/dates`,
  //   selectedDate.toDate().toLocaleDateString().replaceAll("/", "-")
  // );

  // console.log(
  //   selectedDateActivitiesList?.ref
  //     ?.get()
  //     .then((res) => console.log(res.data(), "res")),
  //   "selectedDateActivitiesList"
  // );

  const { docs: dateSpecificActivitiesList } = useFirestore(
    `users/${user.uid}/dates/${selectedDate
      .toDate()
      .toLocaleDateString()
      .replaceAll("/", "-")}/date-specific-activities`
  );

  useEffect(() => {
    dateSpecificActivitiesList?.forEach((el) => {
      const isActivityFoundInActivitiesCollection = activitiesList.find(
        (activity) => activity.id === el.activityId
      );

      if (!isActivityFoundInActivitiesCollection)
        dateSpecificActivitiesCollectionRef.doc(el.activityId).delete();
    });
  });

  const getAppropriateTimestamp = () => {
    // can't use now() as timestamp if activity is being added to a past date, hence all this
    const isSelectedDateSameAsCurrentDate =
      selectedDate.toDate().toLocaleDateString() ===
      moment().toDate().toLocaleDateString();

    const selectedDateString = selectedDate.toDate().toLocaleDateString(); //"22/2/2222"

    if (isSelectedDateSameAsCurrentDate)
      return { timestamp: moment().unix(), timestampId: `t-${uuidv4()}` };
    else
      return {
        timestamp: moment(selectedDateString).add(6, "hours").unix(),
        timestampId: `t-${uuidv4()}`,
      };
  };

  const getSortedTimestampArr = (timestampArr) => {
    return timestampArr.sort((a, b) => a.timestamp - b.timestamp);
  };

  const getFilteredTimestampsArr = (
    timestampsArr,
    timestampsToBeFilteredArr
  ) => {
    return timestampsArr.filter(
      (el) =>
        !timestampsToBeFilteredArr.find((x) => x.timestampId === el.timestampId)
    );
  };

  console.log(
    dateSpecificActivitiesList,
    "dateSpecificActivitiesList",
    `users/${user.uid}/dates/${selectedDate
      .toDate()
      .toLocaleDateString()
      .replaceAll("/", "-")}/date-specific-activities`
  );

  console.log(
    selectedDate.toDate().toLocaleDateString().replaceAll("/", "-"),
    "selected date"
  );

  //whenever frequency gets updated in any way, two places have to be updated:
  // 1. performedAt in "activities" collection 2. performedAt in "date-specific-activities" collection
  const addActivityToDate = () => {
    const activity = activitiesList.find(
      (activity) => activity.name === selectedActivity
    );
    const newTimestamp = getAppropriateTimestamp();

    // activities-collection
    activitiesCollectionRef.doc(activity.id).set(
      {
        performedAt: getSortedTimestampArr([
          ...activity.performedAt,
          newTimestamp,
        ]),
      },
      { merge: true }
    );

    // date-specific-activities-collection
    dateSpecificActivitiesCollectionRef
      .doc(activity.id)
      .set({
        activityId: activity.id,
        performedAt: [newTimestamp],
        activityRef: firestore
          .collection(`users/${user.uid}/activities/`)
          .doc(activity.id),
      })
      .then(() => console.log("added activity to date"));
  };

  const deleteActivityFromDate = (
    activityId,
    dateSpecificActivitiesPerformedAtArr
  ) => {
    // activities-collection
    const activity = activitiesList?.find((el) => el.id === activityId);
    const activitiesCollectionPerformedAtArr = activity.performedAt;

    activitiesCollectionRef.doc(activityId).set(
      {
        performedAt: getFilteredTimestampsArr(
          activitiesCollectionPerformedAtArr,
          dateSpecificActivitiesPerformedAtArr
        ),
      },
      { merge: true }
    );

    // date-specific-activities-collection
    dateSpecificActivitiesCollectionRef
      .doc(activityId)
      .delete()
      .then(() => console.log("deleted activity from date"));
  };

  const updateFrequency = (
    activityId,
    updateType,
    dateSpecificActivitiesPerformedAtArr
  ) => {
    if (
      updateType === "decrease" &&
      dateSpecificActivitiesPerformedAtArr?.length === 1
    ) {
      deleteActivityFromDate(activityId, dateSpecificActivitiesPerformedAtArr);
      return undefined;
    }

    const activity = activitiesList?.find((el) => el.id === activityId);
    const activitiesCollectionPerformedAtArr = activity.performedAt;

    // todo: update lastUpdatedAt
    if (updateType === "decrease") {
      // date-specific-activities-collection
      dateSpecificActivitiesCollectionRef.doc(activityId).set(
        {
          performedAt: dateSpecificActivitiesPerformedAtArr.slice(0, -1),
        },
        { merge: true }
      );
      // activities-collection
      activitiesCollectionRef.doc(activityId).set(
        {
          performedAt: getFilteredTimestampsArr(
            activitiesCollectionPerformedAtArr,
            [dateSpecificActivitiesPerformedAtArr.at(-1)]
          ),
        },
        { merge: true }
      );
    } else if (updateType === "increase") {
      const newTimestamp = getAppropriateTimestamp();

      // date-specific-activities-collection
      dateSpecificActivitiesCollectionRef.doc(activityId).set(
        {
          performedAt: [...dateSpecificActivitiesPerformedAtArr, newTimestamp],
        },
        { merge: true }
      );
      // activities-collection
      activitiesCollectionRef.doc(activityId).set(
        {
          performedAt: getSortedTimestampArr([
            ...activitiesCollectionPerformedAtArr,
            newTimestamp,
          ]),
        },
        { merge: true }
      );
    }
  };

  const isAddActivityBtnDisabled = () => {
    const isSelectedActivityInvalid =
      activitiesList?.findIndex((el) => el.name === selectedActivity) === -1;

    let isSelectedActivityAlreadyAdded;
    if (!isSelectedActivityInvalid) {
      const activity = activitiesList?.find(
        (el) => el.name === selectedActivity
      );
      isSelectedActivityAlreadyAdded =
        dateSpecificActivitiesList?.findIndex(
          (el) => el.activityId === activity.id
        ) !== -1;
    }

    return isSelectedActivityInvalid || isSelectedActivityAlreadyAdded;
  };

  const isDateValid =
    selectedDate?.toDate()?.toDateString() &&
    selectedDate?.toDate()?.toDateString() !== "Invalid Date";

  const isDateSpecificActivitiesListLoading =
    dateSpecificActivitiesList === null;

  const defaultProps = {
    //todo: check and fix warning
    options: activitiesList || [],
    getOptionLabel: (option) => option.name || "",
  };

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          ...(!isDateValid ? { color: theme.palette.error.main } : {}),
        }}
      >
        {selectedDate?.toDate()?.toDateString() || "Invalid Date"}
      </Typography>
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
            onChange={(value) => setSelectedDate(value)}
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
            id="disable-close-on-select"
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
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "4px 0 0 4px",
                  },
                }}
              />
            )}
          />

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
            disabled={isAddActivityBtnDisabled()}
            onClick={addActivityToDate}
          >
            <AddRoundedIcon />
          </Button>
        </Box>
      </Box>

      <Divider sx={{ m: theme.spacing(3, 0) }} />

      {isDateSpecificActivitiesListLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress sx={{ mt: theme.spacing(5) }} />
        </div>
      )}

      {dateSpecificActivitiesList?.length > 0 && (
        <Container maxWidth="md">
          <TableContainer sx={{ display: { xs: "none", sm: "block" } }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ width: "400px" }}>
                    <Typography variant="h6">
                      <strong>Activity</strong>
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6">
                      <strong>Frequency</strong>
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dateSpecificActivitiesList?.map(
                  ({ activityId, performedAt }) => {
                    const activity = activitiesList?.find(
                      (el) => el.id === activityId
                    );

                    return (
                      <TableRow
                        key={activityId}
                        // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell align="left">
                          <Typography variant="h6" component="span">
                            {activity?.name}
                          </Typography>
                          <Typography component="span" color="text.secondary">
                            &nbsp;x{performedAt?.length}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              size="small"
                              sx={{
                                height: "30px",
                                width: "30px",
                                minWidth: "30px",
                              }}
                              onClick={() =>
                                updateFrequency(
                                  activityId,
                                  "decrease",
                                  performedAt
                                )
                              }
                            >
                              <Typography variant="h6">-</Typography>
                            </Button>
                            <Typography component="span">
                              {performedAt?.length}
                            </Typography>
                            <Button
                              size="small"
                              sx={{
                                height: "30px",
                                width: "30px",
                                minWidth: "30px",
                              }}
                              onClick={() =>
                                updateFrequency(
                                  activityId,
                                  "increase",
                                  performedAt
                                )
                              }
                            >
                              <Typography variant="h6">+</Typography>
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              deleteActivityFromDate(activityId, performedAt)
                            }
                          >
                            <RemoveCircleOutlineRoundedIcon
                              sx={{ color: theme.palette.error.main }}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}

      {dateSpecificActivitiesList?.length === 0 && <div>empty state</div>}

      {dateSpecificActivitiesList?.length > 0 && (
        <Box
          sx={{
            // border: "solid 2px black",
            display: { xs: "flex", sm: "none" },
            flexDirection: "column",
            gap: theme.spacing(1.5),
          }}
        >
          {dateSpecificActivitiesList?.map(({ activityId, performedAt }) => {
            const activity = activitiesList?.find((el) => el.id === activityId);

            return (
              <Card variant="outlined" key={activityId}>
                <CardContent>
                  <div>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // border: "solid 1px black",
                      }}
                    >
                      <Box>
                        <Typography variant="h6" component="span">
                          {activity?.name}
                        </Typography>
                        <Typography component="span" color="text.secondary">
                          &nbsp;x{performedAt?.length}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => deleteActivityFromDate(activityId)}
                      >
                        <RemoveCircleOutlineRoundedIcon
                          sx={{ color: theme.palette.error.main }}
                        />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: theme.spacing(2),
                        // border: "solid 1px black",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        component="div"
                      >
                        Frequency
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Button
                          size="small"
                          // variant="outlined"
                          sx={{
                            height: "30px",
                            width: "30px",
                            minWidth: "30px",
                          }}
                        >
                          <Typography variant="h6">-</Typography>
                        </Button>
                        <Typography component="span">
                          {performedAt?.length}
                        </Typography>
                        <Button
                          size="small"
                          // variant="outlined"
                          sx={{
                            height: "30px",
                            width: "30px",
                            minWidth: "30px",
                          }}
                        >
                          <Typography variant="h6">+</Typography>
                        </Button>
                      </Box>
                    </Box>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default DateManager;
