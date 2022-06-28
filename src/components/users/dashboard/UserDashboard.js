import React, { useState, useEffect } from 'react';
import LastMessages from './LastMessages';
import LastReservations from './LastReservations';
import ReservationLinks from './ReservationLinks';
import Banner from './Banners';

const UserDashboard = ({roleName}) => {
    return (
        <>
            <LastMessages isPublic={true} />
            <br />
            <Banner />
            <br />
            <ReservationLinks roleName={roleName}/>
            <br />
            <LastReservations />
        </>
    );
};

export default UserDashboard;
