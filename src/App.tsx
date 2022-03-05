import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import ActivityManager from "./components/ActivityManager";
import Login from "./components/Auth/Login";
import Charts from "./components/Charts";
import DateManager from "./components/DateManager";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthListener from "./hooks/useAuthListener";
import Header from "./layout/Header";
import { SnackbarProps } from "@mui/material";

function App() {
  // TODO: navigator.online to show some screen when user is offline
  const [user] = useAuthListener();

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
    <div className="App">
      <Router>
        {user && <Header />}

        <Switch>
          <ProtectedRoute
            path="/activity-manager"
            condition={!!user}
            redirectPath="/login"
          >
            <ActivityManager
              handleOpenSnackbar={handleOpenSnackbar}
              handleCloseSnackbar={handleCloseSnackbar}
            />
          </ProtectedRoute>
          <ProtectedRoute
            path="/date-manager/:date"
            condition={!!user}
            redirectPath="/login"
          >
            <DateManager />
          </ProtectedRoute>
          <ProtectedRoute
            path="/charts"
            condition={!!user}
            redirectPath="/login"
          >
            <Charts />
          </ProtectedRoute>
          <ProtectedRoute
            path="/login"
            condition={!user}
            redirectPath="/activity-manager"
          >
            <Login />
          </ProtectedRoute>
          <ProtectedRoute path="/" redirectPath="/login" />
        </Switch>
      </Router>

      <Snackbar {...snackbarProps} open={openSnackbar} />
    </div>
  );
}

export default App;
