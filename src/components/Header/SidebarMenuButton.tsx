import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useTheme from "@mui/material/styles/useTheme";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { navItems } from "./constants";
import { isSelected } from "./helpers/isSelected";
import { navigateTo } from "./helpers/navigateTo";
import { renderIcon } from "./helpers/renderIcon";

const SidebarMenuButton = () => {
  const theme = useTheme();

  const { pathname } = useLocation();
  const history = useHistory();

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
              selected={isSelected(navItem.pathName, pathname)}
              sx={{
                "&::before": {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: isSelected(navItem.pathName, pathname) ? 4 : 0,
                  borderTopLeftRadius: "40px",
                  borderBottomLeftRadius: "40px",
                  backgroundColor: theme.palette.primary.main,
                },
              }}
              onClick={() => navigateTo(navItem.pathName, history)}
            >
              <ListItemIcon>
                {renderIcon({ navItem, pathname, theme })}
              </ListItemIcon>
              <ListItemText
                primary={navItem.name}
                sx={{
                  color: isSelected(navItem.pathName, pathname)
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
      {/* button to toggle drawer */}
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

      {/* the drawer itself */}

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
    </>
  );
};

export default SidebarMenuButton;
