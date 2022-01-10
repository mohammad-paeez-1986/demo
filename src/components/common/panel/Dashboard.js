import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "components/users/dashboard/UserDashboard";
import OperatorDashboard from "./OperatorDashboard";
import axios from "axios";
import notify from "general/notify";

const Dashboard = () => {
    const [dashboardComponent, setDashboardComponent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .post("User/Profile")
            .then(({ data }) => {
                const { rolenameen } = data[0];
                if (rolenameen === "USER") {
                    setDashboardComponent(<UserDashboard />);
                } else if (rolenameen === "ADMIN") {
                    setDashboardComponent(<AdminDashboard />);
                } else if (rolenameen === "OPERATOR") {
                    setDashboardComponent(<AdminDashboard />);
                }
                setLoading(false)
            })
            .catch((errorMessage) => notify.error(errorMessage));
    }, []);

    return (
        <Spin delay={900} spinning={loading} style={{marginTop:"10vh"}}>
            {dashboardComponent && dashboardComponent}
        </Spin>
    );
};

export default Dashboard;
