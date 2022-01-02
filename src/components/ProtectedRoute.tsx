import React from "react";
import { Route, Redirect } from "react-router-dom";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  condition?: boolean;
  path: string;
  redirectPath: string;
}

function ProtectedRoute({
  children,
  condition,
  path,
  redirectPath,
}: ProtectedRouteProps) {
  return (
    <Route path={path} exact>
      {condition ? children : <Redirect to={redirectPath} />}
    </Route>
  );
}

export default ProtectedRoute;
