import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment";
import { Timestamp } from "../../../types";

interface CollapsiblePartProps {
  timestampsArr: Timestamp[];
  openCollapsiblePart: boolean;
}

const CollapsiblePart = (props: CollapsiblePartProps) => {
  const { timestampsArr, openCollapsiblePart } = props;

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

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
            ml: theme.spacing(0),
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
        <Box sx={{ margin: 1, px: 5 }}>
          <Typography
            variant={isSmUp ? "h6" : "inherit"}
            gutterBottom
            component="div"
          >
            History
          </Typography>
          <List
            disablePadding
            sx={{
              maxHeight: "50vh",
              overflowY: "scroll",
              ...(isSmUp
                ? {
                    "&::-webkit-scrollbar": {
                      width: "5px",
                      height: "8px",
                      // backgroundColor: "#2e3338",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: theme.palette.text.disabled,
                      borderRadius: "50px",
                    },
                  }
                : {}),
            }}
          >
            {activityHistoryItems}
          </List>
        </Box>
      </Collapse>
    </>
  );
};

export default CollapsiblePart;
