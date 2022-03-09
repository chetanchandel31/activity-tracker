import { SnackbarProps } from "@mui/material/Snackbar";
import { createContext } from "react";

interface SnackbarContextInterface {
  handleOpenSnackbar: (snackbarProps: SnackbarProps) => void;
  handleCloseSnackbar: (
    _event?: Event | React.SyntheticEvent<Element, Event> | undefined,
    _reason?: string | undefined
  ) => void;
}

export const SnackbarContext = createContext<SnackbarContextInterface>({
  handleCloseSnackbar: () =>
    console.error(
      "component probably isn't wrapped inside SnackbarContextProvider"
    ),
  handleOpenSnackbar: () =>
    console.error(
      "component probably isn't wrapped inside SnackbarContextProvider"
    ),
});
