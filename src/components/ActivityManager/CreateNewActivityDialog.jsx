import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

const CreateNewActivityDialog = ({ open, handleClose }) => {
  // TODO : add notes (optional) placeholder: any additional info you'd like to attach with this activity
  const [newActivityName, setNewActivityName] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!newActivityName) setError("Activity name can't be empty");
    else if (newActivityName.length > 45)
      setError("Activity name must consist less than 45 characters");
    // TODO: maybe change later
    else setError("");
  }, [newActivityName]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create new activity</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can begin assigning this activity to various dates from date
          manager and tracking it from charts after creating it
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label=""
          fullWidth
          //   variant="standard"
          value={newActivityName}
          required
          onChange={({ target }) => setNewActivityName(target.value)}
          onKeyPress={({ key }) => {
            if (key === "Enter") console.log(newActivityName);
          }}
          error={Boolean(error)}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => console.log(newActivityName)}
          disabled={Boolean(error)}
        >
          Create
        </Button>
        {/* if activity created, close dialog, use await or then */}
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewActivityDialog;
