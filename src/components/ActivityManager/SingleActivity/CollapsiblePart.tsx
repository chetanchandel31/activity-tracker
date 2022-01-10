import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { Timestamp } from "../../../types";

interface CollapsiblePartProps {
  timestampsArr: Timestamp[];
  openCollapsiblePart: boolean;
}

const CollapsiblePart = (props: CollapsiblePartProps) => {
  const { timestampsArr, openCollapsiblePart } = props;

  const theme = useTheme();

  const activityHistoryItems: JSX.Element[] = [];

  timestampsArr.forEach((el, i, currentArr) => {
    const doShowBottomMargin =
      currentArr[i + 1] &&
      moment
        .unix(currentArr[i + 1].timestamp)
        .toDate()
        .toDateString() !== moment.unix(el.timestamp).toDate().toDateString();

    const readableTimestamp = `- ${moment
      .unix(el.timestamp)
      .toDate()
      .toDateString()}, ${moment
      .unix(el.timestamp)
      .toDate()
      .toLocaleTimeString()}`;

    activityHistoryItems.push(
      <ListItem disablePadding key={el.timestampId}>
        <ListItemButton
          component="a"
          href="#simple-list"
          sx={{
            padding: theme.spacing(0, 0, 0, 1),
            ml: theme.spacing(1),
            ...(doShowBottomMargin ? { mb: theme.spacing(2) } : {}),
            borderRadius: theme.spacing(1),
          }}
        >
          <ListItemText secondary={readableTimestamp} />
        </ListItemButton>
      </ListItem>
    );
  });

  return (
    <>
      <Collapse in={openCollapsiblePart} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1, pl: 4 }}>
          <Typography variant="h6" gutterBottom component="div">
            History
          </Typography>
          <List disablePadding>{activityHistoryItems}</List>
        </Box>
      </Collapse>
    </>
  );
};

export default CollapsiblePart;
