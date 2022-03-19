import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface CreateNewActivityFabProps {
  isActivitiesListNonEmpty: boolean;
  openCreateActivityDialog: () => void;
}

const CreateNewActivityFab = (props: CreateNewActivityFabProps) => {
  const { isActivitiesListNonEmpty, openCreateActivityDialog } = props;

  return (
    <>
      {isActivitiesListNonEmpty && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Container sx={{ position: "relative" }}>
            <Fab
              color="primary"
              aria-label="add"
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
              }}
              onClick={openCreateActivityDialog}
            >
              <AddRoundedIcon />
            </Fab>
          </Container>
        </Box>
      )}
    </>
  );
};

export default CreateNewActivityFab;
