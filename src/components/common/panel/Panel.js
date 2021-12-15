import React, { useState } from "react";
import { Route, Switch, Link } from "react-router-dom";
import { Layout } from "antd";
import Menus from "./Menus";
import routes from "general/routes";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { useCookies } from "react-cookie";
import logo from "images/logo-mci.png";

// import AddUser from "user/AddUser";
// import ShowUser from "user/ShowUser";
// import AddMessage from "message/AddMessage";
// import ShowMessage from "message/ShowMessage";
// import Dashboard from "./Dashboard";
// import ShowReport from "components/admin/report/ShowReport";
// import ShowSettings from "settings/ShowSettings";
// import ShowUpdateUserForms from "user/ShowUpdateUserForms";
// import AddDailyProgram from "program/AddDailyProgram";
// import AddWelfareCluster from "welfareCluster/AddWelfareCluster";
// import ShowHistory from "program/ShowHistory";
// import NextDayReservations from "program/NextDayReservations";
// import SignOut from "common/auth/SignOut";
// import AdminProfile from "common/auth/AdminProfile";

// // user
// import ShowProfileTabs from "users/profile/ShowProfileTabs";
// import Reserve from "users/reservation/Reserve";
// import ShowUserReservationHistory from "users/reservation/ShowUserReservationHistory";
// import ShowRule from "users/rule/ShowRule";
// import ShowCalendar from "users/reservation/ShowCalendar";

const { Header, Content, Footer, Sider } = Layout;

const Panel = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [, , removeCookie] = useCookies(["token"]);

    // console.log(document.cookie);
    // const [menuList, setMenuList] = useState([]);

    // useEffect(() => {
    //     axios.post("system/menu").then(({ data }) => {
    //         setMenuList(data);
    //     });
    // }, []);


    const toggle = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout>
            <Sider
                collapsed={collapsed}
                trigger="click"
                breakpoint="lg"
                collapsedWidth="80"
                onBreakpoint={(broken) => {
                    if (broken) {
                        setCollapsed(true);
                    } else {
                        setCollapsed(false);
                    }
                }}
                onCollapse={(collapsed, type) => {
                    //   console.log(collapsed, type);
                }}
                className="sider"
            >
                <div className="logo">
                    <img src={logo} alt="logo"/>
                </div>
                <Menus />
            </Sider>
            <Layout>
                <Header
                    className="header"
                    style={{ padding: 0, height: "50px", background: "#fff" }}
                >
                    {React.createElement(
                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                        {
                            className: "trigger",
                            onClick: toggle,
                        }
                    )}
                    {/* <span>سامانه نوبت دهی همراه اول</span> */}

                    <div className="notification-part">
                        <Link to="/signout">
                            <LogoutOutlined
                                style={{ fontSize: 18, color: "#777" }}
                            />
                        </Link>
                    </div>
                </Header>
                <Content style={{ margin: "24px 16px 0" }}>
                    <div
                        className="site-layout-background"
                        style={{ padding: 24, minHeight: 360 }}
                    >
                        <Switch>
                            {routes.map((route, index) => (
                                <Route
                                    key={index}
                                    exact={route.exact}
                                    path={route.path}
                                    component={route.component}
                                />
                            ))}
                        </Switch>
                    </div>
                </Content>
                <Footer className="footer">سامانه نوبتدهی همراه اول</Footer>
            </Layout>
        </Layout>
    );
};

export default Panel;
