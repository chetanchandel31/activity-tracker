import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import Stopwatch from "components/Stopwatch";
import { Activity } from "types";
import { getFormattedDateForTooltip } from "utils";
import ExpandableArea from "./ExpandableArea";

export interface SingleActivityTableRowProps {
  activity: Activity;
  editableActivityName: string | JSX.Element;
  isRecordNowBtnLoading: boolean;
  moreActionsMenuBtn: JSX.Element;
  openExpandableArea: boolean;
  recordActivity: () => void;
  toggleExpandableArea: () => void;
}

const SingleActivityTableRow = (props: SingleActivityTableRowProps) => {
  const {
    activity,
    editableActivityName,
    isRecordNowBtnLoading,
    moreActionsMenuBtn,
    openExpandableArea,
    recordActivity,
    toggleExpandableArea,
  } = props;
  const theme = useTheme();

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ width: "100%" }}>
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
              onClick={toggleExpandableArea}
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
            <Typography component="span">{editableActivityName}</Typography>
          </Box>
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
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
        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
          <Tooltip
            TransitionComponent={Zoom}
            title={getFormattedDateForTooltip(activity.createdAt)}
          >
            <Typography variant="caption">
              <Stopwatch date={activity.createdAt} />
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
          <LoadingButton
            loading={isRecordNowBtnLoading}
            variant="contained"
            sx={{ boxShadow: "none", textTransform: "none" }}
            size="small"
            onClick={recordActivity}
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
  );
};

export default SingleActivityTableRow;
