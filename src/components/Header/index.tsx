import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import useTheme from "@mui/material/styles/useTheme";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Zoom from "@mui/material/Zoom";
import { useThemeContext } from "contexts/theme-context";
import { auth } from "firebase-config/firebase";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { navItems } from "./constants";
import { navigateTo } from "./helpers/navigateTo";
import { renderIcon } from "./helpers/renderIcon";
import SidebarMenuButton from "./SidebarMenuButton";

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

  return (
    <>
      <AppBar
        color="transparent"
        sx={{ backdropFilter: "blur(8px)" }}
        elevation={trigger ? 4 : 0}
        position="fixed"
      >
        <Toolbar>
          <SidebarMenuButton />
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
                  onClick={() => navigateTo(navItem.pathName, history)}
                >
                  {renderIcon({ navItem, pathname, theme })}
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

      <Toolbar sx={{ mb: theme.spacing(3) }} />
    </>
  );
};

export default Header;
