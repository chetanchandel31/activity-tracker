import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { doOpenCreateActivityDialogOnFirstRender } from "utils";

interface RedirectDialogProps {
  open: boolean;
  handleClose: () => void;
  selectedActivity: string;
}

const RedirectDialog = (props: RedirectDialogProps) => {
  const { handleClose, open, selectedActivity } = props;
  const theme = useTheme();
  const history = useHistory();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>No such activity</DialogTitle>
      <DialogContent>
        <DialogContentText>
          No activity called <strong>{selectedActivity}</strong> exists yet. Do
          you want to go to <strong>Activity Manager</strong> and create it?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: theme.spacing(0, 3, 3, 3) }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => doOpenCreateActivityDialogOnFirstRender(history)}
          sx={{ boxShadow: "none" }}
          variant="contained"
        >
          create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RedirectDialog;
