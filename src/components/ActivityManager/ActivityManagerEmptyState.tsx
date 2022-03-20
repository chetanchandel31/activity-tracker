import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import WelcomeImg from "assets/images/welcome.svg";
import moment from "moment";
import { Link as RouterLink } from "react-router-dom";
import { getDateStringFromMoment } from "utils";

interface ActivityManagerEmptyStateProps {
  activitiesListLength: number | undefined;
  openCreateActivityDialog: () => void;
}

const ActivityManagerEmptyState = (props: ActivityManagerEmptyStateProps) => {
  const { activitiesListLength, openCreateActivityDialog } = props;

  return (
    <>
      {activitiesListLength === 0 && (
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <img
            alt="welcome"
            src={WelcomeImg}
            style={{ maxWidth: "600px", width: "90%" }}
          />

          <Typography color="text.primary" sx={{ my: 2 }} variant="h6">
            Start creating activities that can be assigned to individual dates
            via{" "}
            <Link
              component={RouterLink}
              to={`/date-manager/${getDateStringFromMoment(moment())}`}
              underline="none"
            >
              date manager
            </Link>{" "}
            and alayzed from{" "}
            <Link component={RouterLink} to="/charts" underline="none">
              charts
            </Link>
          </Typography>
          <Button
            onClick={openCreateActivityDialog}
            sx={{ boxShadow: "none", textTransform: "none" }}
            variant="contained"
          >
            Create your first activity
          </Button>
        </Box>
      )}
    </>
  );
};

export default ActivityManagerEmptyState;
