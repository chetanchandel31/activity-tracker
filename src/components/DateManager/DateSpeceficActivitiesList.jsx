import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

const DateSpecificActivitiesList = ({
  isDateSpecificActivitiesListLoading,
  dateSpecificActivitiesList,
  updateFrequency,
  activitiesList,
  deleteActivityFromDate,
}) => {
  const theme = useTheme();

  let tableRows = [];
  let cards = []; // same thing but for smaller screens

  dateSpecificActivitiesList?.forEach(({ activityId, performedAt }) => {
    const activity = activitiesList?.find((el) => el.id === activityId);

    const handleDelete = () => deleteActivityFromDate(activityId, performedAt);
    const handleIncreaseFrequency = () =>
      updateFrequency(activityId, "increase", performedAt);
    const handleDecreaseFrequency = () =>
      updateFrequency(activityId, "decrease", performedAt);

    tableRows.push(
      <TableRow
        key={activityId}
        // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell align="left">
          <Typography variant="h6" component="span">
            {activity?.name}
          </Typography>
          <Typography component="span" color="text.secondary">
            &nbsp;x{performedAt?.length}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              size="small"
              sx={{
                height: "30px",
                width: "30px",
                minWidth: "30px",
              }}
              onClick={handleDecreaseFrequency}
            >
              <Typography variant="h6">-</Typography>
            </Button>
            <Typography component="span">{performedAt?.length}</Typography>
            <Button
              size="small"
              sx={{
                height: "30px",
                width: "30px",
                minWidth: "30px",
              }}
              onClick={handleIncreaseFrequency}
            >
              <Typography variant="h6">+</Typography>
            </Button>
          </Box>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleDelete}>
            <RemoveCircleOutlineRoundedIcon
              sx={{ color: theme.palette.error.main }}
            />
          </IconButton>
        </TableCell>
      </TableRow>
    );

    cards.push(
      <Card variant="outlined" key={activityId}>
        <CardContent>
          <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // border: "solid 1px black",
              }}
            >
              <Box>
                <Typography variant="h6" component="span">
                  {activity?.name}
                </Typography>
                <Typography component="span" color="text.secondary">
                  &nbsp;x{performedAt?.length}
                </Typography>
              </Box>
              <IconButton onClick={handleDelete}>
                <RemoveCircleOutlineRoundedIcon
                  sx={{ color: theme.palette.error.main }}
                />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: theme.spacing(2),
                // border: "solid 1px black",
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                component="div"
              >
                Frequency
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  size="small"
                  // variant="outlined"
                  sx={{
                    height: "30px",
                    width: "30px",
                    minWidth: "30px",
                  }}
                  onClick={handleDecreaseFrequency}
                >
                  <Typography variant="h6">-</Typography>
                </Button>
                <Typography component="span">{performedAt?.length}</Typography>
                <Button
                  size="small"
                  // variant="outlined"
                  sx={{
                    height: "30px",
                    width: "30px",
                    minWidth: "30px",
                  }}
                  onClick={handleIncreaseFrequency}
                >
                  <Typography variant="h6">+</Typography>
                </Button>
              </Box>
            </Box>
          </div>
        </CardContent>
      </Card>
    );
  });

  return (
    <>
      {isDateSpecificActivitiesListLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress sx={{ mt: theme.spacing(5) }} />
        </div>
      )}

      {dateSpecificActivitiesList?.length > 0 && (
        <Container maxWidth="md">
          <TableContainer sx={{ display: { xs: "none", sm: "block" } }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ width: "400px" }}>
                    <Typography variant="h6">
                      <strong>Activity</strong>
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6">
                      <strong>Frequency</strong>
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{tableRows}</TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}

      {dateSpecificActivitiesList?.length === 0 && <div>empty state</div>}

      {dateSpecificActivitiesList?.length > 0 && (
        <Box
          sx={{
            // border: "solid 2px black",
            display: { xs: "flex", sm: "none" },
            flexDirection: "column",
            gap: theme.spacing(1.5),
          }}
        >
          {cards}
        </Box>
      )}
    </>
  );
};

export default DateSpecificActivitiesList;