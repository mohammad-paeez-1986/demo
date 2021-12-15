import React from "react";
import { Redirect, Route } from "react-router-dom";
import Login from "./Login";
import { useCookies } from "react-cookie";

const ProtectedRoute = (props) => {
  const [cookies] = useCookies(["token"]);

  return cookies['token'] ? <Route {...props} /> : <Redirect to="/login" />;
};

export default ProtectedRoute;
