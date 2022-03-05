import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MenuIcon from "@mui/icons-material/Menu";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import useTheme from "@mui/material/styles/useTheme";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Zoom from "@mui/material/Zoom";
import { auth } from "firebase-config/firebase";
import moment from "moment";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getDateStringFromMoment } from "utils";

const Header = () => {
  const theme = useTheme();
  const trigger = useScrollTrigger({ threshold: 0, disableHysteresis: true });

  // profile popover
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleUserAvatarClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfilePopoverClose = () => {
    setAnchorEl(null);
  };

  const openProfilePopover = Boolean(anchorEl);

  // navigation
  const history = useHistory();
  const { pathname } = useLocation();

  const navItems = [
    {
      name: "Activity Manager",
      pathName: "/activity-manager",
    },
    {
      name: "Date Manager",
      pathName: `/date-manager`,
    },
    {
      name: "Charts",
      pathName: "/charts",
    },
  ] as const;

  const paths = navItems.map((el) => el.pathName);
  type Path = typeof paths[number];

  const navigateTo = (path: Path) => {
    if (path === "/date-manager")
      history.push(`/date-manager/${getDateStringFromMoment(moment())}`);
    else history.push(`${path}`);
  };
  const isSelected = (path: Path) => pathname.includes(path);

  type NavItem = typeof navItems[number];

  const renderIcon = (navItem: NavItem, isSelected: boolean) => {
    let icon;
    const color = isSelected
      ? theme.palette.primary.main
      : theme.palette.common.black;

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

  // mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = 260;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {navItems.map((navItem) => {
          return (
            <ListItem
              key={navItem.name}
              button
              selected={isSelected(navItem.pathName)}
              sx={{
                "&::before": {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: isSelected(navItem.pathName) ? 4 : 0,
                  borderTopLeftRadius: "40px",
                  borderBottomLeftRadius: "40px",
                  backgroundColor: theme.palette.primary.main,
                },
              }}
              onClick={() => navigateTo(navItem.pathName)}
            >
              <ListItemIcon>
                {renderIcon(navItem, isSelected(navItem.pathName))}
              </ListItemIcon>
              <ListItemText
                primary={navItem.name}
                sx={{
                  color: isSelected(navItem.pathName)
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1, mb: theme.spacing(3) }}>
        <AppBar
          color="transparent"
          sx={{ backdropFilter: "blur(8px)" }}
          elevation={trigger ? 4 : 0}
          position="fixed"
        >
          <Toolbar>
            <IconButton
              // size="large"
              edge="start"
              aria-label="menu"
              sx={{
                mr: 2,
                color: theme.palette.common.black,
                display: { xs: "inline-flex", sm: "none" },
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="h5"
              // color="primary"
              sx={{
                flexGrow: 1,
                textAlign: "left",
                // fontWeight: 600,
                ml: { sm: theme.spacing(7) },
              }}
            >
              {navItems.find((el) => pathname.includes(el.pathName))?.name}
            </Typography>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((navItem) => (
                <Tooltip
                  key={navItem.name}
                  disableInteractive
                  TransitionComponent={Zoom}
                  title={navItem.name}
                >
                  <IconButton
                    sx={{ ml: 0.5 }}
                    onClick={() => navigateTo(navItem.pathName)}
                  >
                    {renderIcon(navItem, isSelected(navItem.pathName))}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
            <IconButton
              sx={{ ml: 2, mr: -1, cursor: "pointer" }}
              onClick={handleUserAvatarClick}
            >
              <Avatar />
            </IconButton>
            <Popover
              open={openProfilePopover}
              anchorEl={anchorEl}
              onClose={handleProfilePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Button onClick={() => auth.signOut()}>Logout</Button>
            </Popover>
          </Toolbar>
        </AppBar>
      </Box>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onOpen={() => setMobileOpen(true)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </SwipeableDrawer>
      </Box>
      <Toolbar />
    </>
  );
};

export default Header;
