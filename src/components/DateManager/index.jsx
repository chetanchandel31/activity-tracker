import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import DateAdapter from "@mui/lab/AdapterMoment";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { useState } from "react";

const DateManager = () => {
  //todo: tooltip for add button
  //todo: can add debounce for counters in frequency
  // todo: prevent user from adding activities to future dates
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedActivity, setSelectedActivity] = useState("");

  const isDateValid =
    selectedDate?.toDate()?.toDateString() &&
    selectedDate?.toDate()?.toDateString() !== "Invalid Date";
  console.log(selectedDate);

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          ...(!isDateValid ? { color: theme.palette.error.main } : {}),
        }}
      >
        {selectedDate?.toDate()?.toDateString() || "Invalid Date"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          mt: theme.spacing(4),
          // border: "solid 2px black",
          alignItems: "center",
          gap: theme.spacing(2),
        }}
      >
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(value) => setSelectedDate(value)}
            disableFuture
            renderInput={(params) => (
              <TextField
                size="small"
                {...params}
                error={
                  selectedDate?.toDate()?.toDateString() === "Invalid Date" ||
                  !selectedDate
                }
                // helperText={params?.inputProps?.placeholder}
                sx={{ width: { xs: "100%", sm: 150 } }}
              />
            )}
          />
          {/* <TextField size="small" error={false} /> */}
        </LocalizationProvider>

        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <FormControl
            sx={{ minWidth: 145, flexGrow: { xs: 1, sm: 0 } }}
            size="small"
          >
            <InputLabel id="demo-simple-select-helper-label">
              Select Activity
            </InputLabel>
            <Select
              // size="small"
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={selectedActivity}
              label="Select Activity"
              onChange={({ target }) => setSelectedActivity(target.value)}
              sx={{ borderRadius: "4px 0 0 4px" }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty Twenty Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            {/* <FormHelperText>o</FormHelperText> */}
            {/* TODO: use autocomplete mui */}
          </FormControl>

          <Button
            variant="contained"
            size="small"
            sx={{
              boxShadow: "none",
              textTransform: "none",
              height: "40px",
              minWidth: "40px",
              maxWidth: "40px",
              borderRadius: "0 4px 4px 0",
            }}
            // endIcon={<AddRoundedIcon />}
          >
            <AddRoundedIcon />
          </Button>
        </Box>
      </Box>

      <Divider sx={{ m: theme.spacing(3, 0) }} />

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
            <TableBody>
              <TableRow
              // key={row.name}
              // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">
                  <Typography variant="h6" component="span">
                    med
                  </Typography>
                  <Typography component="span" color="text.secondary">
                    &nbsp;x2
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
                      sx={{ height: "30px", width: "30px", minWidth: "30px" }}
                    >
                      <Typography variant="h6">-</Typography>
                    </Button>
                    <Typography component="span">555</Typography>
                    <Button
                      size="small"
                      sx={{ height: "30px", width: "30px", minWidth: "30px" }}
                    >
                      <Typography variant="h6">+</Typography>
                    </Button>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton>
                    <RemoveCircleOutlineRoundedIcon
                      sx={{ color: theme.palette.error.main }}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Box
        sx={{
          // border: "solid 2px black",
          display: { xs: "flex", sm: "none" },
          flexDirection: "column",
          gap: theme.spacing(1.5),
        }}
      >
        <Card variant="outlined">
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
                    Med
                  </Typography>
                  <Typography component="span" color="text.secondary">
                    &nbsp;x2
                  </Typography>
                </Box>
                <IconButton>
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
                    sx={{ height: "30px", width: "30px", minWidth: "30px" }}
                  >
                    <Typography variant="h6">-</Typography>
                  </Button>
                  <Typography component="span">5</Typography>
                  <Button
                    size="small"
                    // variant="outlined"
                    sx={{ height: "30px", width: "30px", minWidth: "30px" }}
                  >
                    <Typography variant="h6">+</Typography>
                  </Button>
                </Box>
              </Box>
            </div>
          </CardContent>
        </Card>

        <Card variant="outlined">
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
                <Typography variant="h6">Med</Typography>
                <IconButton>
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

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    size="small"
                    // variant="outlined"
                    sx={{ height: "30px", width: "30px", minWidth: "30px" }}
                  >
                    <Typography variant="h6">-</Typography>
                  </Button>
                  <Typography component="span">5</Typography>
                  <Button
                    size="small"
                    // variant="outlined"
                    sx={{ height: "30px", width: "30px", minWidth: "30px" }}
                  >
                    <Typography variant="h6">+</Typography>
                  </Button>
                </Box>
              </Box>
            </div>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DateManager;
