import React from 'react';
import { Card, Row, Col, Tabs } from 'antd';
import AddDailyProgram from './AddDailyProgram';
import AddRangeProgram from './AddRangeProgram';

const { TabPane } = Tabs;

const ShowAddProgramTabs = ({ match }) => {
    return (
        <Col sm={24} xs={24} md={19} lg={15} xlg={12}>
            <Card>
                <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="ثبت برنامه روزانه" key="tab1">
                        <AddDailyProgram match={match} />
                    </TabPane>
                    <TabPane tab="ثبت برنامه بازه ای" key="tab2">
                        <AddRangeProgram match={match}/>
                    </TabPane>
                </Tabs>
            </Card>
        </Col>
    );
};

export default ShowAddProgramTabs;
