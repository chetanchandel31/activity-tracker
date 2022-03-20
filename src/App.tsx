import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { createBrowserHistory, createHashHistory } from "history";
import { Router, Switch } from "react-router-dom";
import { isElectron } from "utils";
import "./App.css";
import ActivityManager from "./components/ActivityManager";
import Login from "./components/Auth/Login";
import Charts from "./components/Charts";
import DateManager from "./components/DateManager";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthListener from "./hooks/useAuthListener";

const history = isElectron() ? createHashHistory() : createBrowserHistory();

function App() {
  // TODO: navigator.online to show some screen when user is offline
  const [user] = useAuthListener();
  const theme = useTheme();

  return (
    <Box
      className="App"
      sx={{
        backgroundColor: theme.palette.primary.contrastText,
        minHeight: "100vh",
      }}
    >
      <Router history={history}>
        {user && <Header />}

        <Switch>
          <ProtectedRoute
            path="/activity-manager"
            condition={!!user}
            redirectPath="/login"
          >
            <ActivityManager />
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
    </Box>
  );
}

export default App;
