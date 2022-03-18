import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import Stopwatch from "components/Stopwatch";
import { useState } from "react";
import { Activity } from "types";
import { getFormattedDateForTooltip } from "utils";
import DeleteActivityDialog from "./DeleteActivityDialog";
import EditSingleActivityTextfield from "./EditSingleActivityTextfield";
import ExpandableArea from "./ExpandableArea";
import MoreActionsMenuButton from "./MoreActionsMenuButton";

interface SingleActivityProps {
  view: "card" | "tableRow";
  activity: Activity;
  isRecordNowBtnLoading: boolean;
  handleRecordNow: (activity: Activity) => Promise<void>;
}

const SingleActivity = (props: SingleActivityProps) => {
  const { activity, isRecordNowBtnLoading, handleRecordNow, view } = props;

  const theme = useTheme();

  // expand icon
  const [openExpandableArea, setOpenExpandableArea] = useState(false);

  // edit and delete
  const [isEditMode, setIsEditMode] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleClose = () => setIsDeleteDialogOpen(false);

  const moreActionsMenuBtn = (
    <MoreActionsMenuButton
      isEditMode={isEditMode}
      openDeleteDialog={() => setIsDeleteDialogOpen(true)}
      openEditMode={() => setIsEditMode(true)}
    />
  );

  return (
    <>
      {view === "tableRow" && (
        <>
          <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(1),
                }}
              >
                <IconButton
                  size="small"
                  sx={{ ml: 0 }}
                  onClick={() => setOpenExpandableArea((prev) => !prev)}
                >
                  <KeyboardArrowDownIcon
                    sx={{
                      transform: !openExpandableArea
                        ? "rotate(0deg)"
                        : "rotate(-180deg)",
                      transition: theme.transitions.create("transform", {
                        duration: theme.transitions.duration.complex,
                      }),
                    }}
                  />
                </IconButton>
                <Typography component="span">
                  {isEditMode ? (
                    <EditSingleActivityTextfield
                      activity={activity}
                      setIsEditMode={setIsEditMode}
                    />
                  ) : (
                    activity.name
                  )}
                </Typography>
              </Box>
            </TableCell>
            <TableCell align="right">
              <Tooltip
                TransitionComponent={Zoom}
                title={getFormattedDateForTooltip(
                  activity.performedAt.at(-1)?.timestamp
                )}
              >
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
              </Tooltip>
            </TableCell>
            <TableCell align="right">
              <Tooltip
                TransitionComponent={Zoom}
                title={getFormattedDateForTooltip(activity.createdAt)}
              >
                <Typography variant="caption">
                  <Stopwatch date={activity.createdAt} />
                </Typography>
              </Tooltip>
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
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <ExpandableArea
                openExpandableArea={openExpandableArea}
                timestampsArr={activity.performedAt}
              />
            </TableCell>
          </TableRow>
        </>
      )}

      {view === "card" && (
        <Card variant="outlined" key={activity.id}>
          <CardContent
            sx={{ display: "flex", justifyContent: "space-between", pr: 0 }}
          >
            <div>
              <Typography variant="h6" sx={{ mb: theme.spacing(1) }}>
                {isEditMode ? (
                  <EditSingleActivityTextfield
                    activity={activity}
                    setIsEditMode={setIsEditMode}
                  />
                ) : (
                  activity.name
                )}
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {moreActionsMenuBtn}

              <IconButton
                size="small"
                sx={{
                  ml: 0,
                  height: "30px",
                  width: "30px",
                }}
                onClick={() => setOpenExpandableArea((prev) => !prev)}
              >
                <KeyboardArrowDownIcon
                  sx={{
                    transform: !openExpandableArea
                      ? "rotate(0deg)"
                      : "rotate(180deg)",
                    transition: theme.transitions.create("transform", {
                      duration: theme.transitions.duration.complex,
                    }),
                  }}
                />
              </IconButton>
            </Box>
          </CardContent>

          <ExpandableArea
            openExpandableArea={openExpandableArea}
            timestampsArr={activity.performedAt}
          />

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
      )}

      <DeleteActivityDialog
        activity={activity}
        handleClose={handleClose}
        open={isDeleteDialogOpen}
      />
    </>
  );
};

export default SingleActivity;
