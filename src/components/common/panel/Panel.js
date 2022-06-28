import React, { useState } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { Layout, Popconfirm } from 'antd';
import Menus from './Menus';
import routes from 'general/routes';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    UserOutlined 
} from '@ant-design/icons';
import { useCookies } from 'react-cookie';
import logo from 'images/logo-mci.png';


const { Header, Content, Footer, Sider } = Layout;

const Panel = ({ history }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [, , removeCookie] = useCookies(['token']);

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
                trigger='click'
                breakpoint='lg'
                width={210}
                collapsedWidth='80'
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
                className='sider'
            >
                <div className='logo'>
                    <img src={logo} alt='logo' />
                </div>
                <Menus />
            </Sider>
            <Layout>
                <Header
                    className='header'
                >
                    {React.createElement(
                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,  
                        {
                            className: 'trigger',
                            onClick: toggle,    
                        }
                    )}

                    <div className='profile-part'>
                        <div id="profile"></div>
                    </div>

                    <div className='notification-part'>
                        <Popconfirm
                            // visible={popConfirmVisible}
                            title='آیا مطمئن هستید؟'
                            onConfirm={() => history.push('/signout')}
                        >
                            <Link to='/signout'>
                                <LogoutOutlined
                                    style={{ fontSize: 18, color: '#777' }}
                                />
                            </Link>
                        </Popconfirm>
                        {/* <Link to="/signout">
                            <LogoutOutlined
                                style={{ fontSize: 18, color: "#777" }}
                            />
                        </Link> */}
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div
                        className='site-layout-background'
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
                <Footer className='footer'>سامانه نوبتدهی همراه اول</Footer>
            </Layout>
        </Layout>
    );
};

export default Panel;
