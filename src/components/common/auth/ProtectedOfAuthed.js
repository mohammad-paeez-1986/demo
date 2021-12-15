import React from "react";
import { Redirect, Route } from "react-router-dom";
import Panel from "components/common/panel/Panel";
import { useCookies } from "react-cookie";

const ProtectedOfAuthed = (props) => {
    const [cookies] = useCookies(["token"]);

    return !cookies['token'] ? <Route {...props} /> : <Redirect to="/dashboard" />;
};

export default ProtectedOfAuthed;
