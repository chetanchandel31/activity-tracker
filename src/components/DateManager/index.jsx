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
import { useState } from "react";
import { firestore } from "../../firebase/firebase";
import useAuthListener from "../../hooks/useAuthListener";
import useFirestore from "../../hooks/useFirestore";
import useFirestoreDoc from "../../hooks/useFirestoreDoc";

const DateManager = () => {
  //todo: tooltip for add button
  //todo: can add debounce for counters in frequency
  // todo: prevent user from adding activities to future dates
  // TODO: create new activity right from here, mui autocomplete > createable. use same dialog component
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedActivity, setSelectedActivity] = useState("");

  const [user] = useAuthListener();
  const { docs: activitiesList } = useFirestore(`users/${user.uid}/activities`);
  const dateSpecificActivitiesCollectionRef = firestore.collection(
    `users/${user.uid}/dates/${selectedDate
      .toDate()
      .toLocaleDateString()
      .replaceAll("/", "-")}/date-specific-activities`
  );

  const { doc: selectedDateActivitiesList } = useFirestoreDoc(
    `users/${user.uid}/dates`,
    selectedDate.toDate().toLocaleDateString().replaceAll("/", "-")
  );

  console.log(selectedDateActivitiesList, "selectedDateActivitiesList");
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

  const isDateSpecificActivitiesListLoading =
    dateSpecificActivitiesList === null;

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

  const isDateValid =
    selectedDate?.toDate()?.toDateString() &&
    selectedDate?.toDate()?.toDateString() !== "Invalid Date";

  const addActivityToDate = () => {
    const activity = activitiesList.find(
      (activity) => activity.name === selectedActivity
    );

    dateSpecificActivitiesCollectionRef
      .doc(activity.id)
      .set({
        activityId: activity.id,
        frequency: [],
        activityRef: firestore
          .collection(`users/${user.uid}/activities/`)
          .doc(activity.id),
      })
      .then(() => console.log("added activity to date"));
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

  const defaultProps = {
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
                  ({ activityId, frequency }) => {
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
                            &nbsp;x{frequency?.length}
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
                            >
                              <Typography variant="h6">-</Typography>
                            </Button>
                            <Typography component="span">
                              {frequency?.length}
                            </Typography>
                            <Button
                              size="small"
                              sx={{
                                height: "30px",
                                width: "30px",
                                minWidth: "30px",
                              }}
                            >
                              <Typography variant="h6">+</Typography>
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton>
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
          {dateSpecificActivitiesList?.map(({ activityId, frequency }) => {
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
                          {activity.name}
                        </Typography>
                        <Typography component="span" color="text.secondary">
                          &nbsp;x{frequency?.length}
                        </Typography>
                      </Box>
                      <IconButton>
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
                          {frequency?.length}
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
