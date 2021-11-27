import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import moment from "moment";
import { useEffect, useState } from "react";
import { firestore } from "../../firebase/firebase";
import useAuthListener from "../../hooks/useAuthListener";

const CreateNewActivityDialog = ({ open, handleClose }) => {
  const [user] = useAuthListener();
  const activitiesCollectionRef = firestore.collection(
    `users/${user.uid}/activities`
  );

  // TODO : add notes (optional). placeholder: any additional info you'd like to attach with this activity
  const [newActivityName, setNewActivityName] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!newActivityName) setError("Activity name can't be empty");
    else if (newActivityName.length > 45)
      setError("Activity name must consist less than 45 characters");
    // TODO: maybe change later
    else setError("");
  }, [newActivityName]);

  const handleCreateNewActivity = async () => {
    const now = moment().unix();
    try {
      await activitiesCollectionRef.add({
        createdAt: now,
        lastPerformedAt: "never",
        name: newActivityName,
        lastUpdatedAt: now,
      });

      setNewActivityName("");
      handleClose();
    } catch (err) {
      console.log(err);
    }
    // TODO: add check for duplicate activity name
    // TODO: success or failure alert or snackbar
  };

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
            if (key === "Enter") handleCreateNewActivity();
          }}
          error={Boolean(error)}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreateNewActivity} disabled={Boolean(error)}>
          Create
        </Button>
        {/* if activity created, close dialog, use await or then */}
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewActivityDialog;