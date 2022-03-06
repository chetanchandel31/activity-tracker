import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import { ReactNode, useContext, useState } from "react";
import { createContext } from "react";

interface SnackbarContextInterface {
  handleOpenSnackbar: (snackbarProps: SnackbarProps) => void;
  handleCloseSnackbar: (
    _event?: Event | React.SyntheticEvent<Element, Event> | undefined,
    _reason?: string | undefined
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextInterface>({
  handleCloseSnackbar: () =>
    console.error(
      "component probably isn't wrapped inside SnackbarContextProvider"
    ),
  handleOpenSnackbar: () =>
    console.error(
      "component probably isn't wrapped inside SnackbarContextProvider"
    ),
});

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

export const useSnackbar = () => useContext(SnackbarContext);
