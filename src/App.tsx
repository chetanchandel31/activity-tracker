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
    </div>
  );
}

export default App;
