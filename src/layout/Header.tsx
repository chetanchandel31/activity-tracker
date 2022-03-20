import EventRoundedIcon from "@mui/icons-material/EventRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MenuIcon from "@mui/icons-material/Menu";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
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
import { useThemeContext } from "contexts/theme-context";
import { auth } from "firebase-config/firebase";
import moment from "moment";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getDateStringFromMoment } from "utils";

const Header = () => {
  const theme = useTheme();
  const trigger = useScrollTrigger({ threshold: 0, disableHysteresis: true });

  const { isDarkMode, toggleDarkMode } = useThemeContext();

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
              color: theme.palette.text.primary,
              display: { xs: "inline-flex", sm: "none" },
            }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            component="h5"
            color="text.primary"
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
            <Box sx={{ width: "200px" }}>
              {isDarkMode ? (
                <Button
                  fullWidth
                  startIcon={<LightModeRoundedIcon />}
                  sx={{ textTransform: "none" }}
                  onClick={toggleDarkMode}
                >
                  Light
                </Button>
              ) : (
                <Button
                  fullWidth
                  startIcon={<NightlightRoundedIcon />}
                  sx={{ textTransform: "none" }}
                  onClick={toggleDarkMode}
                >
                  Dark
                </Button>
              )}
              <Divider />
              <Button fullWidth onClick={() => auth.signOut()}>
                Logout
              </Button>
            </Box>
          </Popover>
        </Toolbar>
      </AppBar>

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
      <Toolbar sx={{ mb: theme.spacing(3) }} />
    </>
  );
};

export default Header;
