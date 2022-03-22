import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { createBrowserHistory } from "history";
import { Route, Router, Switch } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import "./App.css";
import ActivityManager from "./components/ActivityManager";
import Login from "./components/Auth/Login";
import Charts from "./components/Charts";
import DateManager from "./components/DateManager";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthListener from "./hooks/useAuthListener";
// import {  createHashHistory } from "history";
// import { isElectron } from "utils";

// `<HashRouter />` is recommended for electron but it has limitations so trying to use `<BrowserRouter />` for the time being to see if any issues really arise
// const history = isElectron() ? createHashHistory() : createBrowserHistory();
const history = createBrowserHistory();

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
              <Login />
            </ProtectedRoute>
            <ProtectedRoute path="/" redirectPath="/login" />
          </Switch>
        </QueryParamProvider>
      </Router>
    </Box>
  );
}

export default App;
