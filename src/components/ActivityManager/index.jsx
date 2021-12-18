import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LabelRoundedIcon from "@mui/icons-material/LabelRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, AlertTitle, Button, Slide, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import moment from "moment";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "../../firebase/firebase";
import useAuthListener from "../../hooks/useAuthListener";
import useFirestore from "../../hooks/useFirestore";
import Stopwatch from "../Stopwatch";
import CreateNewActivityDialog from "./CreateNewActivityDialog";

const ActivityManager = ({ handleOpenSnackbar, handleCloseSnackbar }) => {
  //todo: search and sort, maybe filters and labels?
  //todo: show exact date on hover
  // todo: unique activity name
  // tracking since: "shows exact time when activity was registered with this app"
  // todo: loading state and empty state
  const theme = useTheme();
  const [user] = useAuthListener();
  const history = useHistory();

  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const { docs: activitiesList } = useFirestore(`users/${user.uid}/activities`);
  const areActivitiesLoading = activitiesList === null;

  const activitiesCollectionRef = firestore.collection(
    `users/${user.uid}/activities`
  );

  const currentDateString = moment()
    .toDate()
    .toLocaleDateString()
    .replaceAll("/", "-");
  const dateSpecificActivitiesCollectionRef = firestore.collection(
    `users/${user.uid}/dates/${currentDateString}/date-specific-activities`
  );
  const { docs: dateSpecificActivitiesList } = useFirestore(
    `users/${user.uid}/dates/${currentDateString}/date-specific-activities`
  );

  const [isRecordNowBtnLoading, setIsRecordNowBtnLoading] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuBtnClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const [isCreateNewActivityDialogOpen, setIsCreateNewActivityDialogOpen] =
    useState(false);

  const deleteActivity = async (docId) => {
    try {
      await activitiesCollectionRef.doc(docId).delete();
    } catch (err) {
      console.log(err);
    }
    // TODO: 1. success or failure alert or snackbar 2. seperate dialog with red button and text 3. only delete from activities list. store it somewhere. setTimeout before we delete it from dates list. give undo option during this span.
    // on clicking undo: 1. clear timeout so we don't delete activity from dates list 2. restore activity in "activities list" from backup
  };

  const showSuccessMessage = (activity) => {
    // TODO: check key and snackbar close transition
    handleCloseSnackbar();

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
    });
  };

  const handleRecordNow = async (activity) => {
    // activity received as arg will be doc from activitiesCollection
    // TODO: make sure this fn runs only once within a sec
    setIsRecordNowBtnLoading(true);

    const newTimestamp = {
      timestamp: moment().unix(),
      timestampId: `t-${uuidv4()}`,
    };

    const dateSpecificActivity = dateSpecificActivitiesList.find(
      (el) => el.activityId === activity.id
    );
    const isActivityAlreadyPerformedtoday = Boolean(dateSpecificActivity);

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

  const activityTableRows = [];
  const activityCards = [];

  activitiesList?.forEach((activity) => {
    const moreActionsMenuBtn = (
      <Tooltip
        disableInteractive
        TransitionComponent={Zoom}
        title={"More actions"}
        sx={{ ml: theme.spacing(1) }}
      >
        <IconButton onClick={handleMenuBtnClick}>
          <MoreVertRoundedIcon />
        </IconButton>
      </Tooltip>
    );

    const moreActionsMenu = (
      <Menu
        id="basic-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        //
        elevation={4}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: 180,
          },
        }}
        onClick={handleMenuClose}
      >
        <MenuList dense>
          <MenuItem>
            <ListItemIcon>
              <EditRoundedIcon />
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem onClick={() => deleteActivity(activity.id)}>
            <ListItemIcon>
              <DeleteForeverRoundedIcon
                sx={{ color: theme.palette.error.main }}
              />
            </ListItemIcon>
            <Typography sx={{ color: theme.palette.error.main }}>
              Delete
            </Typography>
          </MenuItem>
          <Divider />
        </MenuList>
      </Menu>
    );

    activityTableRows.push(
      <TableRow key={activity.id}>
        <TableCell>
          <Box
            sx={{
              // border: "solid 2px blue",
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(1),
            }}
          >
            <LabelRoundedIcon color="primary" />
            <Typography component="span">{activity.name}</Typography>
          </Box>
        </TableCell>
        <TableCell align="right">
          <Typography variant="caption">
            {activity.performedAt.length === 0 ? (
              "never"
            ) : (
              <Stopwatch
                date={activity.performedAt.at(-1)?.timestamp}
                suffix=" ago"
              />
            )}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="caption">
            <Stopwatch date={activity.createdAt} />
          </Typography>
        </TableCell>
        <TableCell align="right" sx={{ width: 170 }}>
          <LoadingButton
            loading={isRecordNowBtnLoading}
            variant="contained"
            sx={{ boxShadow: "none", textTransform: "none" }}
            size="small"
            onClick={() => handleRecordNow(activity)}
          >
            Record now
          </LoadingButton>
          {moreActionsMenuBtn}
          {/* not adding menu itself on cards seperately coz not needed, this menu itself anchors on card's moreActionsMenuBtn */}
          {moreActionsMenu}
        </TableCell>
      </TableRow>
    );

    // for smaller screens
    activityCards.push(
      <Card variant="outlined" key={activity.id}>
        <CardContent
          sx={{ display: "flex", justifyContent: "space-between", pr: 0 }}
        >
          <div>
            <Typography variant="h6" sx={{ mb: theme.spacing(1) }}>
              {activity.name}
            </Typography>
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >
              last performed{" "}
              {activity.performedAt.length === 0 ? (
                "never"
              ) : (
                <Stopwatch
                  date={activity.performedAt.at(-1)?.timestamp}
                  suffix=" ago"
                />
              )}
            </Typography>
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              tracking since <Stopwatch date={activity.createdAt} />
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "start" }}>
            {moreActionsMenuBtn}
          </div>
        </CardContent>

        <CardActions>
          <LoadingButton
            loading={isRecordNowBtnLoading}
            variant="contained"
            // size="small"
            fullWidth
            sx={{ boxShadow: "none", textTransform: "none" }}
            onClick={() => handleRecordNow(activity)}
          >
            Record now
          </LoadingButton>
        </CardActions>
      </Card>
    );
  });

  return (
    <Container>
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
      {activitiesList?.length > 0 && (
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

      {activitiesList?.length > 0 && (
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

      {/* todo: virtualised list, transition and activity name character limit */}
      {/* todo: extra padding after last item to prevent fab overlapping */}
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
