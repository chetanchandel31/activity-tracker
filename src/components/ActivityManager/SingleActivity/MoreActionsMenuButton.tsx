import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import React, { useState } from "react";

interface MoreActionsMenuButtonProps {
  isEditMode: boolean;
  openEditMode: () => void;
  openDeleteDialog: () => void;
}

const MoreActionsMenuButton = (props: MoreActionsMenuButtonProps) => {
  const { isEditMode, openDeleteDialog, openEditMode } = props;

  const theme = useTheme();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuBtnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <>
      {/* 3 dots button */}
      <Tooltip
        disableInteractive
        TransitionComponent={Zoom}
        title={"More actions"}
      >
        <IconButton onClick={handleMenuBtnClick}>
          <MoreVertRoundedIcon />
        </IconButton>
      </Tooltip>

      {/* the menu */}
      <Menu
        id="basic-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        elevation={4}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: 180,
          },
        }}
        onClick={handleMenuClose}
      >
        <MenuList dense>
          <MenuItem disabled={isEditMode} onClick={openEditMode}>
            <ListItemIcon>
              <EditRoundedIcon />
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem onClick={openDeleteDialog}>
            <ListItemIcon>
              <DeleteForeverRoundedIcon
                sx={{ color: theme.palette.error.main }}
              />
            </ListItemIcon>
            <Typography sx={{ color: theme.palette.error.main }}>
              Delete
            </Typography>
          </MenuItem>
          <Divider />
        </MenuList>
      </Menu>
    </>
  );
};

export default MoreActionsMenuButton;
