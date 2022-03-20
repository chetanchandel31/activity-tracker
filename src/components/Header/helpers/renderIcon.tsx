import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import { Theme } from "@mui/material";
import { NavItem } from "../constants";
import { isSelected } from "./isSelected";

interface RenderIconArgs {
  navItem: NavItem;
  /** `pathname` property of value returned by `useLocation` */
  pathname: string;
  theme: Theme;
}

export const renderIcon = ({ navItem, pathname, theme }: RenderIconArgs) => {
  let icon;
  const color = isSelected(navItem.pathName, pathname)
    ? theme.palette.primary.main
    : theme.palette.text.primary;

  if (navItem.name === "Activity Manager") {
    icon = (
      <ListAltIcon
        sx={{
          color: color,
        }}
      />
    );
  } else if (navItem.name === "Date Manager") {
    icon = (
      <EventRoundedIcon
        sx={{
          color: color,
        }}
      />
    );
  } else if (navItem.name === "Charts") {
    icon = (
      <TimelineRoundedIcon
        sx={{
          color: color,
        }}
      />
    );
  }

  return icon;
};
