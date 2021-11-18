import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MenuIcon from "@mui/icons-material/Menu";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const Header = () => {
  const theme = useTheme();

  const history = useHistory();

  const { pathname } = useLocation();

  const navItems = [
    {
      name: "Activity Manager",
      pathName: "/activity-manager",
    },
    {
      name: "Date Manager",
      pathName: "/date-manager",
    },
    {
      name: "Charts",
      pathName: "/charts",
    },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = 260;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigateTo = (path) => history.push(`${path}`);
  const isSelected = (path) => path === pathname;

  const renderIcon = (navItem, isSelected) => {
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

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {navItems.map((navItem) => {
          return (
            <ListItem
              key={navItem.name}
              button
              selected={isSelected(navItem.pathName)} // c
              sx={{
                "&::before": {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: isSelected(navItem.pathName) ? 4 : 0, // c
                  borderTopLeftRadius: "40px",
                  borderBottomLeftRadius: "40px",
                  backgroundColor: theme.palette.primary.main,
                },
              }}
              onClick={() => navigateTo(navItem.pathName)} // c
            >
              <ListItemIcon>
                {renderIcon(navItem, isSelected(navItem.pathName))}
              </ListItemIcon>
              <ListItemText
                primary={navItem.name} // c
                sx={{
                  color: isSelected(navItem.pathName)
                    ? theme.palette.primary.main
                    : theme.palette.text.primary /*c*/,
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
      <Box
        sx={{ flexGrow: 1, backgroundColor: "#ffffff80", mb: theme.spacing(3) }}
      >
        {/* <AppBar position="static"> */}
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
            {navItems.find((el) => el.pathName === pathname)?.name}
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
          <IconButton sx={{ ml: 2, mr: -1 }}>
            <Avatar />
          </IconButton>
        </Toolbar>
        {/* </AppBar> */}
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
    </>
  );
};

export default Header;
