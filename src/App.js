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

function App() {
  // TODO: navigator.online to show some screen when user is offline
  const [user] = useAuthListener();
  console.log(user);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const [snackbarProps, setSnackbarProps] = useState({
    autoHideDuration: 6000,
    onClose: handleCloseSnackbar,
    message: "hi from snackbar",
  });

  const handleOpenSnackbar = (snackbarProps) => {
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
            condition={user}
            redirectPath="/login"
          >
            <ActivityManager
              handleOpenSnackbar={handleOpenSnackbar}
              handleCloseSnackbar={handleCloseSnackbar}
            />
          </ProtectedRoute>
          <ProtectedRoute
            path="/date-manager"
            condition={user}
            redirectPath="/login"
          >
            <DateManager />
          </ProtectedRoute>
          <ProtectedRoute path="/charts" condition={user} redirectPath="/login">
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

      <Snackbar open={openSnackbar} {...snackbarProps} />
    </div>
  );
}

export default App;
