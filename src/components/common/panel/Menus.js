import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
    CalendarOutlined,
    IdcardOutlined,
    UserOutlined,
    SoundOutlined,
    CarOutlined,
    GroupOutlined,
    AuditOutlined,
    BarChartOutlined,
    RestOutlined,
    TrophyOutlined,
    LogoutOutlined,
    WindowsOutlined,
    FileImageOutlined,
    ReconciliationOutlined
} from "@ant-design/icons";
import axios from "axios";

const { SubMenu } = Menu;

const Menus = ({ history }) => {
    const [openKeys, setOpenKeys] = React.useState([]);
    const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);
    const [, setMenuList] = useState([]);
    const [menu, setMenu] = useState(null);

    const createMenu = (menuList) => {
        let menu = [];
        let rootSubmenuKeys = [];
        if (menuList.length) {
            menuList.map((item, i) => {
                let parentURL = item.moduleNameEn;
                const parentKey = "sub" + i;
                if (item.childs.length) {
                    rootSubmenuKeys.push(parentKey);
                    menu.push(
                        <SubMenu
                            key={parentURL}
                            icon={getIcon(parentURL)}
                            title={item.moduleNameFa}
                        >
                            {item.childs.map((child) => {
                                const url = getLink(
                                    child.moduleNameEn,
                                    child.actionNameEn
                                );
                                return (
                                    <Menu.Item key={url}>
                                        <Link to={url}>
                                            {child.actionNameFa}
                                        </Link>
                                    </Menu.Item>
                                );
                            })}
                        </SubMenu>
                    );
                } else {
                    menu.push(
                        <Menu.Item
                            key={"/" + item.moduleNameEn}
                            icon={getIcon(parentURL)}
                        >
                            <Link to={"/" + item.moduleNameEn}>
                                {item.actionNameFa}
                            </Link>
                            {item.moduleNameFa}
                        </Menu.Item>
                    );
                }
            });

            setRootSubmenuKeys(rootSubmenuKeys);
            return menu;
        }
    };

    useEffect(() => {
        axios.post("system/menu").then(({ data }) => {
            setMenuList(data);
            setMenu(createMenu(data));
            setOpenKeys([location.pathname.split("/")[1]]);
        });
    }, []);

    let location = useLocation();

    const handleClick = (e) => {
        // console.log("click ", e);
    };

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const getIcon = (name) => {
        let icon;
        switch (name) {
            case "dashboard":
                icon = <WindowsOutlined />;
                break;
            case "profile":
                icon = <IdcardOutlined />;
                break;
            case "user":
                icon = <UserOutlined />;
                break;
            case "report":
                icon = <BarChartOutlined />;
                break;
            case "rule":
                icon = <AuditOutlined />;
                break;
            case "message":
                icon = <SoundOutlined />;
                break;
            case "gym":
                icon = <TrophyOutlined />;
                break;
            case "carwash":
                icon = <CarOutlined />;
                break;
            case "cafe":
                icon = <RestOutlined />;
                break;
            case "saloon":
                icon = <GroupOutlined />;
                break;
            case "calendar":
                icon = <CalendarOutlined />;
                break;
            case "operator":
                icon = <CalendarOutlined />;
                break;
            case "io":
                icon = <FileImageOutlined />;
                break;
            case "gettodayreservation":
                icon = <CalendarOutlined />;
                break;
            case "clinic":
                icon = <ReconciliationOutlined />
                break;
            case "signout":
                icon = <LogoutOutlined />;
                break;
        }
        return icon;
    };

    // const toSnakeCase = (str) => {
    //     return str.replace(/[A-Z]/g, (letter, i) => {
    //         return i == 0 ? letter.toLowerCase() : "-" + letter.toLowerCase();
    //     });
    // };

    const getLink = (parent, child) => {
        // const firstPart = toSnakeCase(parent);
        // const secondPart = toSnakeCase(child);

        return `/${parent}/${child}`;
    };

    const add = (key) => {
        setRootSubmenuKeys(key);
    };

    return (
        <Menu
            // onClick={handleClick}
            onOpenChange={onOpenChange}
            defaultSelectedKeys={[
                location.pathname !== "/" ? location.pathname : "/dashboard",
            ]}
            openKeys={openKeys}
            // defaultOpenKeys={openKeys}
            mode="inline"
        >
            {menu}
        </Menu>
    );
};

export default Menus;
