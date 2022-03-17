import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import WelcomeImg from "assets/images/welcome.svg";
import { useSnackbarContext } from "contexts/snackbar-context";
import useAuthListener from "hooks/useAuthListener";
import useFirestore from "hooks/useFirestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { ActivitiesList, Activity, DateSpeceficActivitiesList } from "types";
import { getDateStringFromMoment } from "utils";
import CreateNewActivityDialog from "./CreateNewActivityDialog";
import { handleRecordNowInFirestore } from "./helpers/handleRecordNowInFirestore";
import SingleActivity from "./SingleActivity/SingleActivity";

type RouterState =
  | {
      doOpenCreateActivityDialogOnFirstRender: boolean;
      initialActivityName: string;
    }
  | undefined;

const ActivityManager = () => {
  //TODO: search and sort, maybe filters and labels?
  const { handleCloseSnackbar, showAlert } = useSnackbarContext();

  const theme = useTheme();
  const [user] = useAuthListener();

  const history = useHistory();
  const location = useLocation();
  const routerState = location.state as RouterState;

  const currentDateString = getDateStringFromMoment(moment());

  const { docs: activitiesList }: ActivitiesList = useFirestore(
    `users/${user?.uid}/activities`
  );
  const { docs: dateSpecificActivitiesList }: DateSpeceficActivitiesList =
    useFirestore(
      `users/${user?.uid}/dates/${currentDateString}/date-specific-activities`
    );

  const [isRecordNowBtnLoading, setIsRecordNowBtnLoading] = useState(false);

  const [isCreateNewActivityDialogOpen, setIsCreateNewActivityDialogOpen] =
    useState(false);

  useEffect(() => {
    routerState?.doOpenCreateActivityDialogOnFirstRender &&
      setIsCreateNewActivityDialogOpen(true);
  }, [routerState?.doOpenCreateActivityDialogOnFirstRender]);

  const showSuccessMessage = (activity: Activity) => {
    showAlert({
      message: (
        <>
          Added <strong>{activity.name}</strong> to{" "}
          <strong>{currentDateString}</strong>{" "}
          <Button
            color="success"
            onClick={() => {
              history.push(
                `./date-manager/${getDateStringFromMoment(moment())}`
              );
              handleCloseSnackbar();
            }}
          >
            Check
          </Button>
        </>
      ),
    });
  };

  const handleRecordNow = async (activity: Activity) => {
    if (dateSpecificActivitiesList === null) return;
    setIsRecordNowBtnLoading(true);

    const dateSpecificActivity = dateSpecificActivitiesList.find(
      (el) => el.activityId === activity.id
    );

    try {
      await handleRecordNowInFirestore({
        activity,
        dateSpecificActivity,
        user,
      });

      showSuccessMessage(activity);
    } catch (err: any) {
      console.log(err);
      showAlert({
        message: err?.message || "something went wrong 😭",
        alertColor: "error",
      });
    } finally {
      setIsRecordNowBtnLoading(false);
    }
  };

  const activityTableRows: JSX.Element[] = [];
  const activityCards: JSX.Element[] = [];

  activitiesList?.forEach((activity) => {
    // TODO: see if props can be pushed down
    activityTableRows.push(
      <SingleActivity
        view="tableRow"
        activity={activity}
        handleRecordNow={handleRecordNow}
        isRecordNowBtnLoading={isRecordNowBtnLoading}
        key={activity.id}
      />
    );

    // for smaller screens
    activityCards.push(
      <SingleActivity
        view="card"
        activity={activity}
        handleRecordNow={handleRecordNow}
        isRecordNowBtnLoading={isRecordNowBtnLoading}
        key={activity.id}
      />
    );
  });

  const isActivitiesListNonEmpty = activitiesList && activitiesList.length > 0;
  const areActivitiesLoading = activitiesList === null;

  return (
    <>
      <Helmet>
        <title>Activity Manager</title>
      </Helmet>

      <Container sx={{ pb: theme.spacing(8.5) }}>
        {isActivitiesListNonEmpty && (
          <Typography sx={{ mb: theme.spacing(3) }}>
            Here is the list of activities you are currently tracking
          </Typography>
        )}

        {/* 1. loading state */}
        {areActivitiesLoading && (
          <div style={{ textAlign: "center" }}>
            <CircularProgress sx={{ mt: theme.spacing(5) }} />
          </div>
        )}

        {/* 2. actual list */}
        {isActivitiesListNonEmpty && (
          <TableContainer sx={{ display: { xs: "none", sm: "block" } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="421">
                    <Typography sx={{ pl: theme.spacing(4) }}>
                      <strong>Activity</strong>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      <strong>Last performed</strong>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      <strong>Tracking since</strong>
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>{activityTableRows}</TableBody>
            </Table>
          </TableContainer>
        )}

        {isActivitiesListNonEmpty && (
          <Box
            sx={{
              // border: "solid 2px black"
              display: { xs: "flex", sm: "none" },
              flexDirection: "column",
              gap: theme.spacing(1.5),
            }}
          >
            {activityCards}
          </Box>
        )}

        {/* 3. empty state */}
        {activitiesList?.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <img
              alt="welcome"
              src={WelcomeImg}
              style={{ maxWidth: "600px", width: "90%" }}
            />

            <Typography sx={{ my: 2 }} variant="h6">
              Start creating activities that can be assigned to individual dates
              via{" "}
              <Link
                component={RouterLink}
                to={`/date-manager/${getDateStringFromMoment(moment())}`}
                underline="none"
              >
                date manager
              </Link>{" "}
              and alayzed from{" "}
              <Link component={RouterLink} to="/charts" underline="none">
                charts
              </Link>
            </Typography>
            <Button
              onClick={() => setIsCreateNewActivityDialogOpen(true)}
              sx={{ boxShadow: "none", textTransform: "none" }}
              variant="contained"
            >
              Create your first activity
            </Button>
          </Box>
        )}

        {/* TODO: virtualised list, transition and activity name character limit */}
        {isActivitiesListNonEmpty && (
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Container sx={{ position: "relative" }}>
              <Fab
                color="primary"
                aria-label="add"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                }}
                onClick={() => setIsCreateNewActivityDialogOpen(true)}
              >
                <AddRoundedIcon />
              </Fab>
            </Container>
          </Box>
        )}

        <CreateNewActivityDialog
          activitiesList={activitiesList}
          initialActivityName={routerState?.initialActivityName}
          handleClose={() => setIsCreateNewActivityDialogOpen(false)}
          open={isCreateNewActivityDialogOpen}
        />
      </Container>
    </>
  );
};

export default ActivityManager;
