import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { createBrowserHistory, createHashHistory } from "history";
import { Route, Router, Switch } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { isElectron } from "utils";
import "./App.css";
import ActivityManager from "./components/ActivityManager";
import Auth from "./components/Auth";
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
        <QueryParamProvider ReactRouterRoute={Route}>
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
              <Auth />
            </ProtectedRoute>
            <ProtectedRoute path="/" redirectPath="/login" />
          </Switch>
        </QueryParamProvider>
      </Router>
    </Box>
  );
}

export default App;
