import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
// import Panel from 'components/common/panel/Panel';
import { useCookies } from 'react-cookie';

const ProtectedOfAuthed = (props) => {
    const [cookies] = useCookies(['token']);
    const [returnValue, setReturnValue] = useState(null);

    useEffect(() => {
        if (!cookies['token']) {
            setReturnValue(<Route {...props} />);
        } else {
            setReturnValue(<Redirect to="/dashboard" />);
        }
    }, [cookies]);

    // return !cookies['token'] ? <Route {...props} /> : alert(cookies['token']);
    return returnValue;
};

export default ProtectedOfAuthed;
