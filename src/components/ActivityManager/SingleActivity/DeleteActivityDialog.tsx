import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import { useSnackbarContext } from "contexts/snackbar-context";
import { firestore } from "firebase-config/firebase";
import useAuthListener from "hooks/useAuthListener";
import { Activity } from "types";
import { deleteFirestoreDoc } from "utils";

interface DeleteActivityDialogProps {
  activity: Activity;
  open: boolean;
  handleClose: () => void;
}

const DeleteActivityDialog = (props: DeleteActivityDialogProps) => {
  const { activity, handleClose, open } = props;

  const theme = useTheme();

  const [user] = useAuthListener();
  const activitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/activities`
  );

  const { showAlert, handleCloseSnackbar } = useSnackbarContext();

  const undoDeletionAndHideSnackbar = async ({
    createdAt,
    id,
    lastUpdatedAt,
    name,
    performedAt,
  }: Activity) => {
    await activitiesCollectionRef
      .doc(id)
      .set({ createdAt, lastUpdatedAt, name, performedAt });
    handleCloseSnackbar();
  };

  const handleDelete = async (activity: Activity) => {
    try {
      await deleteFirestoreDoc(activitiesCollectionRef, activity.id);
      // delete dialog parent component only gets removed upon deleting so don't really need to close dialog explicitly
      handleClose();
      showAlert({
        message: (
          <>
            <strong>{activity.name}</strong> deleted{" "}
            <Button
              color="success"
              onClick={() => undoDeletionAndHideSnackbar(activity)}
            >
              UNDO
            </Button>
          </>
        ),
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Delete <strong>{activity.name}</strong>?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleting an activity will also delete all records of it from{" "}
          <strong>Date Manager</strong>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: theme.spacing(0, 3, 3, 3) }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          color="error"
          onClick={() => handleDelete(activity)}
          sx={{ boxShadow: "none" }}
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteActivityDialog;
