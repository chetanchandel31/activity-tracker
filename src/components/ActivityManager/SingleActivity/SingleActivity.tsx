import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import React, { useState } from "react";
import { Activity } from "../../../types";
import Stopwatch from "../../Stopwatch";
import CollapsiblePart from "./CollapsiblePart";

interface SingleActivityProps {
  view: "card" | "tableRow";
  activity: Activity;
  deleteActivity: (docId: string) => Promise<void>;
  isRecordNowBtnLoading: boolean;
  handleRecordNow: (activity: Activity) => Promise<void>;
}

const SingleActivity = (props: SingleActivityProps) => {
  const {
    activity,
    deleteActivity,
    isRecordNowBtnLoading,
    handleRecordNow,
    view,
  } = props;

  const theme = useTheme();

  // more-actions menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuBtnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const moreActionsMenuBtn = (
    <Tooltip
      disableInteractive
      TransitionComponent={Zoom}
      title={"More actions"}
      sx={{ ml: theme.spacing(1) }}
    >
      <IconButton onClick={handleMenuBtnClick}>
        <MoreVertRoundedIcon />
      </IconButton>
    </Tooltip>
  );

  // expand icon
  const [openCollapsiblePart, setOpenCollapsiblePart] = useState(false); // TODO: better naming

  return (
    <>
      {view === "tableRow" && (
        <>
          <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(1),
                }}
              >
                <IconButton
                  size="small"
                  sx={{ ml: 0 }}
                  onClick={() => setOpenCollapsiblePart((prev) => !prev)}
                >
                  <KeyboardArrowDownIcon
                    sx={{
                      transform: !openCollapsiblePart
                        ? "rotate(0deg)"
                        : "rotate(-180deg)",
                      transition: theme.transitions.create("transform", {
                        duration: theme.transitions.duration.complex,
                      }),
                    }}
                  />
                </IconButton>
                <Typography component="span">{activity.name}</Typography>
              </Box>
            </TableCell>
            <TableCell align="right">
              <Typography variant="caption">
                {activity.performedAt.length === 0 ? (
                  "never"
                ) : (
                  <Stopwatch
                    date={activity.performedAt.at(-1)?.timestamp}
                    suffix=" ago"
                  />
                )}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="caption">
                <Stopwatch date={activity.createdAt} />
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{ width: 170 }}>
              <LoadingButton
                loading={isRecordNowBtnLoading}
                variant="contained"
                sx={{ boxShadow: "none", textTransform: "none" }}
                size="small"
                onClick={() => handleRecordNow(activity)}
              >
                Record now
              </LoadingButton>
              {moreActionsMenuBtn}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <CollapsiblePart
                openCollapsiblePart={openCollapsiblePart}
                timestampsArr={activity.performedAt}
              />
            </TableCell>
          </TableRow>
        </>
      )}

      {view === "card" && (
        <Card variant="outlined" key={activity.id}>
          <CardContent
            sx={{ display: "flex", justifyContent: "space-between", pr: 0 }}
          >
            <div>
              <Typography variant="h6" sx={{ mb: theme.spacing(1) }}>
                {activity.name}
              </Typography>
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                last performed{" "}
                {activity.performedAt.length === 0 ? (
                  "never"
                ) : (
                  <Stopwatch
                    date={activity.performedAt.at(-1)?.timestamp}
                    suffix=" ago"
                  />
                )}
              </Typography>
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                tracking since <Stopwatch date={activity.createdAt} />
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {moreActionsMenuBtn}

              <IconButton
                size="small"
                sx={{
                  ml: 0,
                  height: "30px",
                  width: "30px",
                }}
                onClick={() => setOpenCollapsiblePart((prev) => !prev)}
              >
                <KeyboardArrowDownIcon
                  sx={{
                    transform: !openCollapsiblePart
                      ? "rotate(0deg)"
                      : "rotate(180deg)",
                    transition: theme.transitions.create("transform", {
                      duration: theme.transitions.duration.complex,
                    }),
                  }}
                />
              </IconButton>
            </div>
          </CardContent>

          <CollapsiblePart
            openCollapsiblePart={openCollapsiblePart}
            timestampsArr={activity.performedAt}
          />

          <CardActions>
            <LoadingButton
              loading={isRecordNowBtnLoading}
              variant="contained"
              // size="small"
              fullWidth
              sx={{ boxShadow: "none", textTransform: "none" }}
              onClick={() => handleRecordNow(activity)}
            >
              Record now
            </LoadingButton>
          </CardActions>
        </Card>
      )}

      {/* menu */}
      <Menu
        id="basic-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        //
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
          <MenuItem>
            <ListItemIcon>
              <EditRoundedIcon />
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem onClick={() => deleteActivity(activity.id)}>
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

export default SingleActivity;
