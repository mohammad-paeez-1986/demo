import React, { useState, useEffect } from "react";
import { Card, Tabs, Col } from "antd";
import ChangePassword from "./ChangePassword";
import Profile from "./Profile";
const { TabPane } = Tabs;

const ShowUpdateUserForms = ({ history }) => {
    // const [userId1, setUserId] = useState(null)

    // useEffect(() => {
    //     if (history.location.state && history.location.state.userId) {
    //         const { userId } = history.location.state;
    //         setUserId(userId);
    //         console.log(userId1);
    //     }
    // }, [userId1]);

    return (
        <Col sm={24} xs={24} md={19} lg={15} xlg={12}>
            <Card>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="اطلاعات کاربری" key="1">
                        <Profile />
                    </TabPane>
                    <TabPane tab="تغییر رمز عبور" key="2">
                        <ChangePassword />
                    </TabPane>
                </Tabs>
            </Card>
        </Col>
    );
};

export default ShowUpdateUserForms;
