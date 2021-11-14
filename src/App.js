import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./layout/Header";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <ProtectedRoute path="/activity-manager" condition>
            <div>hi</div>
          </ProtectedRoute>
          <ProtectedRoute path="/date-manager" condition>
            <div>date manager</div>
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
