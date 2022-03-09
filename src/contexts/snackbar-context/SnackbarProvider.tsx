import Alert, { AlertColor } from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactNode, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SnackbarContext } from "./snackbar-context";

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    _reason?: string
  ) => {
    setOpenSnackbar(false);

    // TODO: Add reset props logic here
  };

  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>({
    autoHideDuration: 6000,
    onClose: handleCloseSnackbar,
    message: "hi from snackbar",
  });

  const handleOpenSnackbar = (snackbarProps: SnackbarProps) => {
    setSnackbarProps((prev) => ({ ...prev, ...snackbarProps }));
    setOpenSnackbar(true);
  };

  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const showAlert = ({
    message = "hi from alert",
    alertColor = "success",
  }: {
    message?: ReactNode;
    alertColor?: AlertColor;
  }) => {
    handleOpenSnackbar({
      autoHideDuration: 4000,
      children: (
        <Alert
          severity={alertColor}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {message}
        </Alert>
      ),
      TransitionComponent: (props) => <Slide {...props} direction="left" />,
      ...(isSmDown
        ? { anchorOrigin: { vertical: "top", horizontal: "center" } }
        : {}),
      key: uuidv4(),
    });
  };

  return (
    <SnackbarContext.Provider
      value={{ handleOpenSnackbar, handleCloseSnackbar, showAlert }}
    >
      {children}
      <Snackbar {...snackbarProps} open={openSnackbar} />
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => useContext(SnackbarContext);
