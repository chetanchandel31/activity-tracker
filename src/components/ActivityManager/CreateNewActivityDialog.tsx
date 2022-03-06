import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { firestore } from "firebase-config/firebase";
import useAuthListener from "hooks/useAuthListener";
import moment from "moment";
import { useEffect, useState } from "react";
import { Activity } from "types";

interface CreateNewActivityDialogProps {
  activitiesList: Activity[] | null;
  open: boolean;
  handleClose: () => void;
}

const CreateNewActivityDialog = ({
  activitiesList,
  handleClose,
  open,
}: CreateNewActivityDialogProps) => {
  const theme = useTheme();

  const [user] = useAuthListener();
  const activitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/activities`
  );

  // TODO: add notes (optional). placeholder: any additional info you'd like to attach with this activity
  const [newActivityName, setNewActivityName] = useState("");

  const [error, setError] = useState("");

  const existingActivitiesNames = activitiesList?.map(
    (activity) => activity.name
  );

  useEffect(() => {
    if (!newActivityName) setError("Activity name can't be empty");
    else if (newActivityName.length > 45)
      setError("Activity name must consist less than 45 characters");
    else if (existingActivitiesNames?.includes(newActivityName))
      setError("An activity by this name already exists");
    // TODO: maybe change later
    else setError("");
    // eslint-disable-next-line
  }, [newActivityName]);

  const handleCreateNewActivity = async () => {
    const now = moment().unix();
    try {
      await activitiesCollectionRef.add({
        createdAt: now,
        performedAt: [],
        name: newActivityName,
        lastUpdatedAt: now,
      });

      setNewActivityName("");
      handleClose();
    } catch (err) {
      console.log(err);
    }
    // TODO: success or failure alert or snackbar
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create new activity</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can begin assigning this activity to various dates from{" "}
          <strong>date manager</strong> and tracking it from{" "}
          <strong>charts</strong> after creating it
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
      <DialogActions sx={{ padding: theme.spacing(0, 3, 3, 3) }}>
        <Button
          onClick={() => {
            handleClose();
            setNewActivityName("");
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateNewActivity}
          disabled={Boolean(error)}
          variant="contained"
          sx={{ boxShadow: "none" }}
        >
          Create
        </Button>
        {/* if activity created, close dialog, use await or then */}
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewActivityDialog;
