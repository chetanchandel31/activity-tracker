import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Timestamp } from "types";
import { getDateStringFromMoment } from "utils";

interface ExpandableAreaProps {
  timestampsArr: Timestamp[];
  openExpandableArea: boolean;
}

const ExpandableArea = (props: ExpandableAreaProps) => {
  const { timestampsArr, openExpandableArea } = props;

  const history = useHistory();

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [isEarliestFirst, setIsEarliestFirst] = useState(true);

  // history list items
  const activityHistoryItems: JSX.Element[] = [];

  timestampsArr
    .sort((a, b) => {
      if (isEarliestFirst) return a.timestamp - b.timestamp;
      else return b.timestamp - a.timestamp;
    })
    .forEach((el, i, currentArr) => {
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
            onClick={() =>
              history.push(
                `./date-manager/${getDateStringFromMoment(
                  moment.unix(el.timestamp)
                )}`
              )
            }
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
      <Collapse in={openExpandableArea} timeout="auto" unmountOnExit>
        <Box sx={{ m: 1, px: 4 }}>
          <Typography
            variant={isSmUp ? "h6" : "inherit"}
            gutterBottom
            component="div"
          >
            History
            <IconButton
              size="small"
              onClick={() => setIsEarliestFirst((prev) => !prev)}
            >
              <ArrowDownwardRoundedIcon
                sx={{
                  height: "15px",
                  width: "15px",
                  transform: isEarliestFirst
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
                  transition: theme.transitions.create("transform", {
                    duration: theme.transitions.duration.complex,
                  }),
                }}
              />
            </IconButton>
          </Typography>
          <List
            disablePadding
            sx={{
              maxHeight: "50vh",
              overflowY: "scroll",

              "&::-webkit-scrollbar": {
                width: "5px",
                background: "rgba(0, 0, 0, 0.15)",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(0, 0, 0, 0.25)",
                borderRadius: "50px",
              },
            }}
          >
            {activityHistoryItems}
          </List>

          {activityHistoryItems.length === 0 && (
            <Box sx={{ textAlign: "center", mt: 2, mb: 6 }}>
              <Typography
                sx={{ userSelect: "none" }}
                color="GrayText"
                variant="body2"
              >
                Datewise history of an activity will appear here as they're
                added to various dates
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </>
  );
};

export default ExpandableArea;
