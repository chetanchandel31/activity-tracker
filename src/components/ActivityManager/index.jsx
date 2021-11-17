import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Card,
  CardContent,
  Container,
  Divider,
  Fab,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { Box } from "@mui/system";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import LabelRoundedIcon from "@mui/icons-material/LabelRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const ActivityManager = () => {
  const theme = useTheme();

  return (
    <Container>
      <Typography>
        Here is the list of activities you are currently tracking
      </Typography>

      <TableContainer sx={{ display: { xs: "none", sm: "block" } }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="421"></TableCell>
              <TableCell align="right">
                <Typography>
                  <strong>last performed</strong>
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography>
                  <strong>tracking since</strong>
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>
                <Box
                  sx={{
                    // border: "solid 2px blue",
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing(1),
                  }}
                >
                  <LabelRoundedIcon color="primary" />
                  <Typography component="span">hap</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="caption"> 99d 99h 99m 33s ago</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="caption">99d 99h 99m 33s </Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip
                  disableInteractive
                  TransitionComponent={Zoom}
                  title={"Delete Activity"}
                >
                  <IconButton>
                    <RemoveCircleOutlineRoundedIcon
                      sx={{ color: theme.palette.error.main }}
                    />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Box
                  sx={{
                    border: "solid 2px blue",
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing(1),
                  }}
                >
                  <LabelRoundedIcon color="primary" />
                  <Typography component="span">hap hap hap hap</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="caption"> 99d 99h 99m 33s ago</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="caption">99d 99h 99m 33s</Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip
                  disableInteractive
                  TransitionComponent={Zoom}
                  title={"Delete Activity"}
                >
                  <IconButton>
                    <RemoveCircleOutlineRoundedIcon
                      sx={{ color: theme.palette.error.main }}
                    />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          // border: "solid 2px black"
          display: { xs: "flex", sm: "none" },
          flexDirection: "column",
          gap: theme.spacing(1.5),
        }}
      >
        <Card variant="outlined">
          <CardContent
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <Typography sx={{ mb: theme.spacing(1) }}>Com</Typography>
              <Typography variant="caption" component="div">
                last performed 99h 99m 33s ago
              </Typography>
              <Typography variant="caption" component="div">
                tracking since 99d 99h 99m 99s
              </Typography>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip
                disableInteractive
                TransitionComponent={Zoom}
                title={"Delete Activity"}
              >
                <IconButton>
                  <RemoveCircleOutlineRoundedIcon
                    sx={{ color: theme.palette.error.main }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <Typography sx={{ mb: theme.spacing(1) }}>Com</Typography>
              <Typography variant="caption" component="div">
                last performed 99h 99m 33s ago
              </Typography>
              <Typography variant="caption" component="div">
                tracking since 99d 99h 99m 99s
              </Typography>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip
                disableInteractive
                TransitionComponent={Zoom}
                title={"Delete Activity"}
              >
                <IconButton>
                  <RemoveCircleOutlineRoundedIcon
                    sx={{ color: theme.palette.error.main }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </Box>

      {/* todo: virtualised list, transition and activity name character limit */}
      {/* todo: extra padding after last item to prevent fab overlapping */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Container sx={{ position: "relative" }}>
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              //   transition: "min-width 2s",
              //   width: "135px",
            }}
          >
            <AddRoundedIcon />
          </Fab>
        </Container>
      </Box>
    </Container>
  );
};

export default ActivityManager;
