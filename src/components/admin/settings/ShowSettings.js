import React, { useState, useEffect } from 'react';
import { Card, Col, Select, Tabs } from 'antd';
// import DatePicker from "react-multi-date-picker";
// import TimePicker from "react-multi-date-picker/plugins/time_picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
import VipSettings from './VipSettings';
import GeneralSettings from './GeneralSettings';
import ClusterSettings from './ClusterSettings';
import ServicesSettings from './ServicesSettings';
import axios from 'axios';

const { TabPane } = Tabs;

const ShowSettings = ({ match }) => {
    const [welfareId, setWelfareId] = useState(null);
    const [firstComponent, setFirstComponent] = useState(null);
    const [clusterName, setClusterName] = useState(null);
    const [, setActiveTab] = useState(1);
    const { url } = match;

    useEffect(() => {
        setActiveTab(1);
        const type = url.split('/')[1]?.toUpperCase();
        axios.post('Welfare/Get', { type }).then(({ data }) => {
            const welfareId = data[0].id;
            setWelfareId(welfareId);

            if (welfareId === 2) {
                setClusterName('اتاق');
            } else if (welfareId === 4) {
                setClusterName('میز');
            } else if (welfareId === 5) {
                setClusterName('مشاور');
            }

            setFirstComponent(<GeneralSettings welfareId={welfareId} />);
        });
    }, [url]);

    const onTabChange = (e) => {
        // alert(e);
        setActiveTab(e);
    };

    return (
        <Col sm={24} xs={24} md={24} lg={16} xlg={16}>
            <Card title='تنظیمات'>
                <Tabs defaultActiveKey='1' centered onChange={onTabChange}>
                    <TabPane tab='تنظیمات کلی' key='1'>
                        {/* <GeneralSettings welfareId={welfareId}/> */}
                        {firstComponent}
                    </TabPane>
                    <TabPane tab='تنظیمات وی آپی' key='2'>
                        <VipSettings welfareId={welfareId} />
                    </TabPane>
                    {welfareId == 2 || welfareId == 4 || welfareId == 5  ? (
                        <TabPane tab={`تنظیمات ${clusterName}`} key='3'>
                            <ClusterSettings welfareId={welfareId} />
                        </TabPane>
                    ) : null}
                    {welfareId == 3 ? (
                        <TabPane tab='تنظیمات خدمات' key='3'>
                            <ServicesSettings welfareId={welfareId} />
                        </TabPane>
                    ) : null}
                </Tabs>
            </Card>
        </Col>
    );
};

export default ShowSettings;
