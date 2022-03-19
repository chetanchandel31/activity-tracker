import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useAuthListener from "hooks/useAuthListener";
import useFirestore from "hooks/useFirestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { ActivitiesList, DateSpeceficActivitiesList } from "types";
import { getDateStringFromMoment } from "utils";
import ActivityManagerEmptyState from "./ActivityManagerEmptyState";
import CreateNewActivityDialog from "./CreateNewActivityDialog";
import CreateNewActivityFab from "./CreateNewActivityFab";
import SingleActivity from "./SingleActivity/SingleActivity";

type RouterState =
  | {
      doOpenCreateActivityDialogOnFirstRender: boolean;
      initialActivityName: string;
    }
  | undefined;

const ActivityManager = () => {
  //TODO: search and sort, maybe filters and labels?

  const theme = useTheme();
  const [user] = useAuthListener();

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

  const [isCreateNewActivityDialogOpen, setIsCreateNewActivityDialogOpen] =
    useState(false);
  const openCreateActivityDialog = () => setIsCreateNewActivityDialogOpen(true);

  useEffect(() => {
    routerState?.doOpenCreateActivityDialogOnFirstRender &&
      setIsCreateNewActivityDialogOpen(true);
  }, [routerState?.doOpenCreateActivityDialogOnFirstRender]);

  const activityTableRows: JSX.Element[] = [];
  const activityCards: JSX.Element[] = [];

  activitiesList?.forEach((activity) => {
    activityTableRows.push(
      <SingleActivity
        view="tableRow"
        activity={activity}
        dateSpecificActivitiesList={dateSpecificActivitiesList}
        key={activity.id}
      />
    );

    // for smaller screens
    activityCards.push(
      <SingleActivity
        view="card"
        activity={activity}
        dateSpecificActivitiesList={dateSpecificActivitiesList}
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
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ mt: theme.spacing(5) }} />
          </Box>
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
        <ActivityManagerEmptyState
          activitiesListLength={activitiesList?.length}
          openCreateActivityDialog={openCreateActivityDialog}
        />

        {/* TODO: virtualised list, transition and activity name character limit */}
        <CreateNewActivityFab
          isActivitiesListNonEmpty={Boolean(isActivitiesListNonEmpty)}
          openCreateActivityDialog={openCreateActivityDialog}
        />

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
