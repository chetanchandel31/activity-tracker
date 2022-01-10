import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import Slide from "@mui/material/Slide";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "../../firebase/firebase";
import useAuthListener from "../../hooks/useAuthListener";
import useFirestore from "../../hooks/useFirestore";
import { getDateStringFromMoment } from "../../utils";
import CreateNewActivityDialog from "./CreateNewActivityDialog";
import SingleActivity from "./SingleActivity/SingleActivity";
import { SnackbarProps } from "@mui/material";
import {
  ActivitiesList,
  Activity,
  DateSpeceficActivitiesList,
} from "../../types";

interface ActivityManagerProps {
  handleOpenSnackbar: (snackbarProps: SnackbarProps) => void;
  handleCloseSnackbar: (
    event?: React.SyntheticEvent | Event,
    reason?: string | undefined
  ) => void;
}

const ActivityManager = (props: ActivityManagerProps) => {
  //TODO: search and sort, maybe filters and labels?
  //TODO: show exact date on hover
  // TODO: unique activity name
  // tracking since: "shows exact time when activity was registered with this app"
  // TODO: loading state and empty state
  const { handleOpenSnackbar, handleCloseSnackbar } = props;

  const theme = useTheme();
  const [user] = useAuthListener();
  const history = useHistory();

  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const { docs: activitiesList }: ActivitiesList = useFirestore(
    `users/${user.uid}/activities`
  );

  const areActivitiesLoading = activitiesList === null;

  console.log(activitiesList);

  const activitiesCollectionRef = firestore.collection(
    `users/${user.uid}/activities`
  );

  const currentDateString = getDateStringFromMoment(moment());

  const dateSpecificActivitiesCollectionRef = firestore.collection(
    `users/${user.uid}/dates/${currentDateString}/date-specific-activities`
  );

  const { docs: dateSpecificActivitiesList }: DateSpeceficActivitiesList =
    useFirestore(
      `users/${user.uid}/dates/${currentDateString}/date-specific-activities`
    );

  const [isRecordNowBtnLoading, setIsRecordNowBtnLoading] = useState(false);

  const [isCreateNewActivityDialogOpen, setIsCreateNewActivityDialogOpen] =
    useState(false);

  const deleteActivity = async (docId: string) => {
    if (!activitiesList) return;

    try {
      if (
        window.confirm(
          `delete ${activitiesList.find((el) => el.id === docId)?.name} ?`
        )
      )
        await activitiesCollectionRef.doc(docId).delete();
    } catch (err) {
      console.log(err);
    }
    // TODO: 1. success or failure alert or snackbar 2. seperate dialog with red button and text 3. only delete from activities list. store it somewhere. setTimeout before we delete it from dates list. give undo option during this span.
    // on clicking undo: 1. clear timeout so we don't delete activity from dates list 2. restore activity in "activities list" from backup
  };

  const showSuccessMessage = (activity: Activity) => {
    handleOpenSnackbar({
      autoHideDuration: 4000,
      children: (
        <Alert
          severity="success"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          Added <strong>{activity.name}</strong> to{" "}
          <strong>{currentDateString}</strong>{" "}
          <Button
            color="success"
            onClick={() => {
              history.push("./date-manager");
              handleCloseSnackbar();
            }}
          >
            Check
          </Button>
        </Alert>
      ),
      TransitionComponent: (props) => <Slide {...props} direction="left" />,
      ...(isSmDown
        ? { anchorOrigin: { vertical: "top", horizontal: "center" } }
        : {}),
      key: uuidv4(),
    });
  };

  const handleRecordNow = async (activity: Activity) => {
    // activity received as arg will be doc from activitiesCollection
    // TODO: make sure this fn runs only once within a sec
    if (dateSpecificActivitiesList === null) return;
    setIsRecordNowBtnLoading(true);

    const newTimestamp = {
      timestamp: moment().unix(),
      timestampId: `t-${uuidv4()}`,
    };

    const dateSpecificActivity = dateSpecificActivitiesList.find(
      (el) => el.activityId === activity.id
    );
    const isActivityAlreadyPerformedtoday = dateSpecificActivity !== undefined;

    try {
      if (isActivityAlreadyPerformedtoday) {
        // date-specific-activities-collection
        await dateSpecificActivitiesCollectionRef.doc(activity.id).set(
          {
            performedAt: [...dateSpecificActivity.performedAt, newTimestamp],
          },
          { merge: true }
        );
        // activities-collection
        await activitiesCollectionRef.doc(activity.id).set(
          {
            performedAt: [...activity.performedAt, newTimestamp],
          },
          { merge: true }
        );
      } else {
        // date-specific-activities-collection
        await dateSpecificActivitiesCollectionRef.doc(activity.id).set({
          activityId: activity.id,
          performedAt: [newTimestamp],
          activityRef: firestore
            .collection(`users/${user.uid}/activities/`)
            .doc(activity.id),
        });
        // activities-collection
        await activitiesCollectionRef.doc(activity.id).set(
          {
            performedAt: [...activity.performedAt, newTimestamp],
          },
          { merge: true }
        );
      }

      showSuccessMessage(activity);
    } catch (err) {
      console.log(err);
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
        deleteActivity={deleteActivity}
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
        deleteActivity={deleteActivity}
        handleRecordNow={handleRecordNow}
        isRecordNowBtnLoading={isRecordNowBtnLoading}
        key={activity.id}
      />
    );
  });

  const isActivitiesListNonEmpty = activitiesList && activitiesList.length > 0;

  return (
    <Container sx={{ pb: theme.spacing(8.5) }}>
      <Typography sx={{ mb: theme.spacing(3) }}>
        Here is the list of activities you are currently tracking
      </Typography>

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

      {/* 3. empty state */}
      {activitiesList?.length === 0 && <div>empty state</div>}

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

      {/* TODO: virtualised list, transition and activity name character limit */}
      {/* TODO: extra padding after last item to prevent fab overlapping */}
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
              //   transition: "min-width 2s",
              //   width: "135px",
            }}
            onClick={() => setIsCreateNewActivityDialogOpen(true)}
          >
            <AddRoundedIcon />
          </Fab>
        </Container>
      </Box>

      <CreateNewActivityDialog
        open={isCreateNewActivityDialogOpen}
        handleClose={() => setIsCreateNewActivityDialogOpen(false)}
      />
    </Container>
  );
};

export default ActivityManager;
