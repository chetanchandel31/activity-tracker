import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import { ReactNode, useContext, useState } from "react";
import { SnackbarContext } from "./snackbar-context";

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <SnackbarContext.Provider
      value={{ handleOpenSnackbar, handleCloseSnackbar }}
    >
      {children}
      <Snackbar {...snackbarProps} open={openSnackbar} />
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => useContext(SnackbarContext);
