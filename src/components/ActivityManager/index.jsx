import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LabelRoundedIcon from "@mui/icons-material/LabelRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
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
import { useState } from "react";
import { firestore } from "../../firebase/firebase";
import useAuthListener from "../../hooks/useAuthListener";
import useFirestore from "../../hooks/useFirestore";
import Stopwatch from "../Stopwatch";
import CreateNewActivityDialog from "./CreateNewActivityDialog";

const ActivityManager = () => {
  //todo: search and sort, maybe filters and labels?
  //todo: show exact date on hover
  // todo: unique activity name
  // tracking since: "shows exact time when activity was registered with this app"
  // todo: loading state and empty state
  const [user] = useAuthListener();
  const { docs: activitiesList } = useFirestore(`users/${user.uid}/activities`);
  const areActivitiesLoading = activitiesList === null;

  const activitiesCollectionRef = firestore.collection(
    `users/${user.uid}/activities`
  );

  console.log(activitiesList, "activities list");

  const [isCreateNewActivityDialogOpen, setIsCreateNewActivityDialogOpen] =
    useState(false);

  const theme = useTheme();

  const deleteActivity = async (docId) => {
    try {
      await activitiesCollectionRef.doc(docId).delete();
    } catch (err) {
      console.log(err);
    }
    // TODO: 1. success or failure alert or snackbar 2. seperate dialog with red button and text 3. only delete from activities list. store it somewhere. setTimeout before we delete it from dates list. give undo option during this span.
    // on clicking undo: 1. clear timeout so we don't delete activity from dates list 2. restore activity in "activities list" from backup
  };

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

            <TableBody>
              {activitiesList?.map((activity) => {
                return (
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
                        <Typography component="span">
                          {activity.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption">
                        {" "}
                        99d 99h 99m 33s ago
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption">
                        <Stopwatch date={activity.createdAt} />
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip
                        disableInteractive
                        TransitionComponent={Zoom}
                        title={"Delete Activity"}
                      >
                        <IconButton onClick={() => deleteActivity(activity.id)}>
                          <RemoveCircleOutlineRoundedIcon
                            sx={{ color: theme.palette.error.main }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell>
                  <Box
                    sx={{
                      border: "solid 2px blue",
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing(1),
                    }}
                  >
                    <LabelRoundedIcon color="primary" />
                    <Typography component="span">hap hap hap hap</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption">
                    {" "}
                    99d 99h 99m 33s ago
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption">99d 99h 99m 33s</Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip
                    disableInteractive
                    TransitionComponent={Zoom}
                    title={"Delete Activity"}
                  >
                    <IconButton>
                      <RemoveCircleOutlineRoundedIcon
                        sx={{ color: theme.palette.error.main }}
                      />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
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
          {activitiesList?.map((activity) => {
            return (
              <Card variant="outlined" key={activity.id}>
                <CardContent
                  sx={{ display: "flex", justifyContent: "space-between" }}
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
                      last performed 99h 99m 33s ago
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Tooltip
                      disableInteractive
                      TransitionComponent={Zoom}
                      title={"Delete Activity"}
                    >
                      <IconButton onClick={() => deleteActivity(activity.id)}>
                        <RemoveCircleOutlineRoundedIcon
                          sx={{ color: theme.palette.error.main }}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card variant="outlined">
            <CardContent
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <Typography variant="h6" sx={{ mb: theme.spacing(1) }}>
                  Hap hap
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  last performed 99h 99m 33s ago
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  tracking since 99d 99h 99m 99s
                </Typography>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Tooltip
                  disableInteractive
                  TransitionComponent={Zoom}
                  title={"Delete Activity"}
                >
                  <IconButton>
                    <RemoveCircleOutlineRoundedIcon
                      sx={{ color: theme.palette.error.main }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
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
