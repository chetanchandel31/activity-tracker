import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Stopwatch from "components/Stopwatch";
import ExpandableArea from "./ExpandableArea";
import { SingleActivityTableRowProps } from "./SingleActivityTableRow";

type SingleActivityCardProps = SingleActivityTableRowProps;

const SingleActivityCard = (props: SingleActivityCardProps) => {
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
    <Card variant="outlined" key={activity.id}>
      <CardContent
        sx={{ display: "flex", justifyContent: "space-between", pr: 0 }}
      >
        <div>
          <Typography variant="h6" sx={{ mb: theme.spacing(1) }}>
            {editableActivityName}
          </Typography>
          <Typography variant="caption" component="div" color="text.secondary">
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
            onClick={toggleExpandableArea}
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
          sx={{ boxShadow: "none", textTransform: "none", mb: 1 }}
          onClick={recordActivity}
        >
          Record now
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default SingleActivityCard;
