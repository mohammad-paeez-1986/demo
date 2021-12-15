import React, { useState, useEffect } from "react";
import LastMessages from "./LastMessages";
import LastReservations from "./LastReservations";
import ReservationLinks from "./ReservationLinks";
import Banner from './Banners';

const UserDashboard = () => {
    return (
        <>
            <LastMessages />
            <br/>
            <Banner />
            <br />
            <ReservationLinks />
            <br />
            <LastReservations />
        </>
    );
};

export default UserDashboard;
