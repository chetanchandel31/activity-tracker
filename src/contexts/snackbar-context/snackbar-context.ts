import { AlertColor } from "@mui/material";
import { SnackbarProps } from "@mui/material/Snackbar";
import { createContext, ReactNode } from "react";

interface SnackbarContextInterface {
  /** most flexible way to open a snackbar. gives full flexibility to pass whatever props needed to `<Snackbar />` */
  handleOpenSnackbar: (snackbarProps: SnackbarProps) => void;
  handleCloseSnackbar: (
    _event?: Event | React.SyntheticEvent<Element, Event> | undefined,
    _reason?: string | undefined
  ) => void;
  /** more abstracted version of `handleOpenSnackbar`. needs minimum info and handles rest of the configuration by itself */
  showAlert: ({
    message,
    alertColor,
  }: {
    message?: ReactNode;
    alertColor?: AlertColor | undefined;
  }) => void;
}

const logError = () =>
  console.error(
    "component probably isn't wrapped inside <SnackbarContextProvider />"
  );

export const SnackbarContext = createContext<SnackbarContextInterface>({
  handleCloseSnackbar: logError,
  handleOpenSnackbar: logError,
  showAlert: logError,
});
