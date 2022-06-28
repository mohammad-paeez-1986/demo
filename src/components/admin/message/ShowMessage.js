import React, { useState, useEffect } from 'react';
import { Spin, List, Button, Card, Switch, Badge, Col, Modal } from 'antd';
import axios from 'axios';
import UpdateMessage from './UpdateMessage';
import { getUriAndMessageType } from 'general/Helper';
import notify from 'general/notify';

const ShowMessage = ({ match }) => {
    const [messageList, setMessageList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageType, setMessageType] = useState(null);
    const [selectedMessageData, setSelectedMessageData] = useState({});

    // get path
    const { path } = match;
    const pathArray = path.split('/');

    // get type and welfareName from path
    const type = pathArray[1];
    const welfareName = pathArray[2];

    // get welfareId by welfareName
    const getWelfareInfo = (welfareName) => {
        let welfareId, welfareNameFa;
        switch (welfareName) {
            case 'gym':
                welfareId = 1;
                welfareNameFa = 'باشگاه';
                break;
            case 'room':
                welfareId = 2;
                welfareNameFa = 'اتاق جلسات';
                break;
            case 'carwash':
                welfareId = 3;
                welfareNameFa = 'کارواش';
                break;
            case 'cafe':
                welfareId = 4;
                welfareNameFa = 'کافه';
                break;
            case 'clinic':
                welfareId = 5;
                welfareNameFa = 'کلینیک منابع انسانی';
                break;
            case 'public':
                welfareId = 0;
                welfareNameFa = 'عمومی';
                break;
        }

        return {
            welfareId,
            welfareNameFa,
        };
    };

    const { welfareId, welfareNameFa } = getWelfareInfo(welfareName);

    const closeModalAndRefreshData = (newData) => {
        setIsModalVisible(false);

        // const newMessageList = messageList.map((item) => {
        //     if (item.id === newData.id) {
        //         return newData;
        //     }

        //     return item;
        // });

        // setMessageList(newMessageList);
        firstTime();
    };

    const firstTime = () => {
        const { uri, messageType } = getUriAndMessageType(type);
        setMessageType(messageType);
        setLoading(true);


        const isPublic = welfareId === 0 ? true : false;

        axios
            .post(`/${uri}/Get`, {
                welfareId,
                isPublic,
            })
            .then(({ data }) => {
                setMessageList(data);
                setLoading(false);
            });

        window.scrollTo(0, 0);
    };

    useEffect(() => {
        firstTime();
    }, [path]);

    const onActivityChange = (action, id) => {
        if (!action) {
            return;
        }

        const uri = action === true ? 'Activate' : 'DeActivate';
        axios
            .post(`/Messaging/${uri}`, { id })
            .then(({ message }) => {
                notify.success(message);

                // update messageList
                // const newMessageList = messageList.map((item) => {
                //     if (item.id === id) {
                //         return { ...item, isActive: action };
                //     }
                //     if (action === true) {
                //         return { ...item, isActive: false };
                //     }

                //     return item;
                // });

                // setMessageList(newMessageList);
                firstTime();
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    const onEditClick = (data) => {
        setSelectedMessageData(data);
        setIsModalVisible(true);
    };

    const modalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <Col sm={24} xs={24} md={19} lg={16} xlg={16}>
            <Card title={`لیست ${messageType} های ${welfareNameFa}`}>
                <Spin delay={900} spinning={loading}>
                    <List
                        itemLayout='vertical'
                        size='large'
                        dataSource={messageList}
                        renderItem={({ title, body, isActive, id }) => (
                            <List.Item
                                key={title}
                                actions={[
                                    <div class='list-switch-container'>
                                        <Switch
                                            size='small'
                                            checkedChildren='فعال'
                                            unCheckedChildren='غیرفعال'
                                            checked={isActive}
                                            onChange={(e) =>
                                                onActivityChange(e, id)
                                            }
                                        />
                                    </div>,
                                    <div className='list-action-left'>
                                        <Button
                                            type='default'
                                            size='small'
                                            onClick={() =>
                                                onEditClick({ id, title, body })
                                            }
                                        >
                                            ویرایش
                                        </Button>
                                    </div>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={[
                                        <Badge
                                            dot
                                            color={isActive ? 'green' : 'pink'}
                                            className='list-badge'
                                        ></Badge>,
                                        title,
                                    ]}
                                    className='sm-font'
                                    description={body
                                        .split('\n')
                                        .map((item, idx) => (
                                            <span key={idx}>
                                                {item}
                                                <br />
                                            </span>
                                        ))}
                                />
                            </List.Item>
                        )}
                    />
                </Spin>
            </Card>

            <Modal
                title='ویرایش'
                footer={null}
                visible={isModalVisible}
                onCancel={modalClose}
                destroyOnClose={true}
            >
                <UpdateMessage
                    messageData={selectedMessageData}
                    onSuccess={closeModalAndRefreshData}
                />
            </Modal>
        </Col>
    );
};

export default ShowMessage;
