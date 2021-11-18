import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import ActivityManager from "./components/ActivityManager";
import DateManager from "./components/DateManager";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./layout/Header";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />

        <Switch>
          <ProtectedRoute path="/activity-manager" condition>
            <ActivityManager />
          </ProtectedRoute>
          <ProtectedRoute path="/date-manager" condition>
            <DateManager />
          </ProtectedRoute>
          <ProtectedRoute path="/charts" condition>
            <div>charts</div>
          </ProtectedRoute>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
