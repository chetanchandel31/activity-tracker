import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DateAdapter from "@mui/lab/AdapterMoment";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { useState } from "react";

const DateManager = () => {
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedActivity, setSelectedActivity] = useState("");
  console.log(selectedDate);

  return (
    <Container>
      {/* red inout field and red colored invalid date */}
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        {selectedDate?.toDate()?.toDateString() || "Invalid Date"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: theme.spacing(4),
          // border: "solid 2px black",
          alignItems: "flex-end",
        }}
      >
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(value) => setSelectedDate(value)}
            renderInput={(params) => (
              <TextField
                size="small"
                {...params}
                error={
                  selectedDate?.toDate()?.toDateString() === "Invalid Date" ||
                  !selectedDate
                }
                // helperText={params?.inputProps?.placeholder}
                sx={{ width: 150 }}
              />
            )}
          />
          {/* <TextField size="small" error={false} /> */}
        </LocalizationProvider>

        <Box
          sx={{
            display: "flex",
          }}
        >
          <FormControl sx={{ minWidth: 145 }} size="small">
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
          </FormControl>

          <Button
            variant="contained"
            size="small"
            sx={{
              boxShadow: "none",
              textTransform: "none",
              height: "40px",
              borderRadius: "0 4px 4px 0",
            }}
            endIcon={<AddRoundedIcon />}
          >
            Add Activity
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DateManager;
