import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useSnackbarContext } from "contexts/snackbar-context";
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

const CreateNewActivityDialog = (props: CreateNewActivityDialogProps) => {
  const { activitiesList, handleClose, open } = props;

  const theme = useTheme();

  const [user] = useAuthListener();
  const activitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/activities`
  );

  const { showAlert } = useSnackbarContext();

  // TODO: add notes (optional). placeholder: any additional info you'd like to attach with this activity
  const [newActivityName, setNewActivityName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      await activitiesCollectionRef.add({
        createdAt: now,
        performedAt: [],
        name: newActivityName,
        lastUpdatedAt: now,
      });

      showAlert({
        message: (
          <>
            Created new activity <strong>{newActivityName}</strong>
          </>
        ),
      });
      setNewActivityName("");
      handleClose();
    } catch (err) {
      showAlert({
        message: "something went wrong 😭",
        alertColor: "error",
      });
      console.log(err);
    } finally {
      setIsLoading(false);
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
          fullWidth
          margin="dense"
          label=""
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
        <LoadingButton
          loading={isLoading}
          onClick={() => {
            handleClose();
            setNewActivityName("");
          }}
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          disabled={Boolean(error)}
          loading={isLoading}
          onClick={handleCreateNewActivity}
          sx={{ boxShadow: "none" }}
          variant="contained"
        >
          Create
        </LoadingButton>
        {/* if activity created, close dialog, use await or then */}
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewActivityDialog;
