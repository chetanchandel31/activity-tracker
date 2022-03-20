import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
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
import NoActivities from "assets/images/no-activities.svg";
import useAuthListener from "hooks/useAuthListener";
import moment from "moment";
import { RefObject } from "react";
import { Activity, DateSpeceficActivity } from "types";
import { deleteActivityFromDate } from "./helpers/deleteActivityFromDate";
import { updateFrequency } from "./helpers/updateFrequency";

interface DateSpecificActivitiesListProps {
  activityMenuRef: RefObject<HTMLDivElement>;
  dateSpecificActivitiesList: DateSpeceficActivity[] | null;
  activitiesList: Activity[] | null;
  selectedDate: moment.Moment;
}

const DateSpecificActivitiesList = (props: DateSpecificActivitiesListProps) => {
  const {
    activitiesList,
    activityMenuRef,
    dateSpecificActivitiesList,
    selectedDate,
  } = props;
  const [user] = useAuthListener();
  const theme = useTheme();

  const isDateSpecificActivitiesListLoading =
    dateSpecificActivitiesList === null;

  let tableRows: JSX.Element[] = [];
  let cards: JSX.Element[] = []; // same thing but for smaller screens

  dateSpecificActivitiesList?.forEach(({ activityId, performedAt }) => {
    const activity = activitiesList?.find((el) => el.id === activityId);

    const handleDelete = () =>
      deleteActivityFromDate({
        activitiesList,
        activityId,
        dateSpecificActivitiesPerformedAtArr: performedAt,
        selectedDate,
        user,
      });

    const handleUpdateFrequency = (updateType: "increase" | "decrease") =>
      updateFrequency({
        activitiesList,
        activityId,
        dateSpecificActivitiesPerformedAtArr: performedAt,
        selectedDate,
        updateType,
        user,
      });

    tableRows.push(
      <TableRow key={activityId}>
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
              onClick={() => handleUpdateFrequency("decrease")}
            >
              <Typography variant="h6">-</Typography>
            </Button>
            <Typography component="span">{performedAt?.length}</Typography>
            <Button
              size="small"
              sx={{
                height: "30px",
                width: "30px",
                minWidth: "30px",
              }}
              onClick={() => handleUpdateFrequency("increase")}
            >
              <Typography variant="h6">+</Typography>
            </Button>
          </Box>
        </TableCell>
        <TableCell align="right">
          <Tooltip
            disableInteractive
            title={`remove ${activity?.name} from ${selectedDate.format("LL")}`}
            TransitionComponent={Zoom}
          >
            <IconButton onClick={handleDelete}>
              <RemoveCircleOutlineRoundedIcon
                sx={{ color: theme.palette.error.main }}
              />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );

    cards.push(
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
              <IconButton onClick={handleDelete}>
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
                  onClick={() => handleUpdateFrequency("decrease")}
                >
                  <Typography variant="h6">-</Typography>
                </Button>
                <Typography component="span">{performedAt?.length}</Typography>
                <Button
                  size="small"
                  // variant="outlined"
                  sx={{
                    height: "30px",
                    width: "30px",
                    minWidth: "30px",
                  }}
                  onClick={() => handleUpdateFrequency("increase")}
                >
                  <Typography variant="h6">+</Typography>
                </Button>
              </Box>
            </Box>
          </div>
        </CardContent>
      </Card>
    );
  });

  const isDateSpecificActivitiesListNonEmpty =
    dateSpecificActivitiesList && dateSpecificActivitiesList?.length > 0;

  return (
    <>
      {isDateSpecificActivitiesListLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress sx={{ mt: theme.spacing(5) }} />
        </div>
      )}

      {isDateSpecificActivitiesListNonEmpty && (
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

              <TableBody>{tableRows}</TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}

      {dateSpecificActivitiesList?.length === 0 && (
        <Box sx={{ textAlign: "center" }}>
          <img
            alt="no-activities"
            src={NoActivities}
            style={{ maxWidth: "400px", width: "80%" }}
          />
          <Typography
            color="text.primary"
            sx={{ m: 1, userSelect: "none" }}
            variant="h6"
          >
            There are no activities added to this date
          </Typography>
          <Button
            onClick={() => {
              activityMenuRef.current?.scrollIntoView(false);
              activityMenuRef.current?.click();
            }}
            sx={{ boxShadow: "none", textTransform: "none", mb: 4 }}
            variant="contained"
          >
            Add an activity
          </Button>
        </Box>
      )}

      {isDateSpecificActivitiesListNonEmpty && (
        <Box
          sx={{
            // border: "solid 2px black",
            display: { xs: "flex", sm: "none" },
            flexDirection: "column",
            gap: theme.spacing(1.5),
          }}
        >
          {cards}
        </Box>
      )}
    </>
  );
};

export default DateSpecificActivitiesList;
