import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LabelRoundedIcon from "@mui/icons-material/LabelRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";

const ActivityManager = () => {
  //todo: search and sort, maybe filters and labels?
  //todo: show exact date on hover
  const theme = useTheme();

  return (
    <Container>
      <Typography sx={{ mb: theme.spacing(3) }}>
        Here is the list of activities you are currently tracking
      </Typography>

      <TableContainer sx={{ display: { xs: "none", sm: "block" } }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="421">
                <Typography sx={{ pl: theme.spacing(4) }}>
                  <strong>Activity</strong>
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography>
                  <strong>Last performed</strong>
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography>
                  <strong>Tracking since</strong>
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
              <Typography variant="h6" sx={{ mb: theme.spacing(1) }}>
                Hap
              </Typography>
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                last performed 99h 99m 33s ago
              </Typography>
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
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
              <Typography variant="h6" sx={{ mb: theme.spacing(1) }}>
                Hap hap
              </Typography>
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                last performed 99h 99m 33s ago
              </Typography>
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
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
