import React, { useState, useEffect } from 'react';
import { Card, Col, Table, Popconfirm, Modal } from 'antd';
import notify from 'general/notify';
import axios from 'axios';
import {
    CloseOutlined,
    CheckOutlined,
    CloseSquareOutlined,
    PicRightOutlined,
} from '@ant-design/icons';
import ShowReservationServices from 'components/common/reservation/ShowReservationServices';

const ShowUserReservationHistory = ({ match }) => {
    const [loading, setLoading] = useState(false);
    const [welfareId, setWelfareId] = useState(null);
    const [historyList, setHistoryList] = useState([]);
    const [isFirstRequestSent, setIsFirstRequestSent] = useState(false);
    const [reservationId, setReservationId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { url } = match;

    // const onFinish = (values) => {
    //     values.welfareId = welfareId;rou
    //     values.dateFrom = getDateFromObject(values.dateFrom);
    //     values.dateTo = getDateFromObject(values.dateTo);

    //     setLoading(true);
    //     axios
    //         .post("User/GetHistory", values)
    //         .then(({ data }) => {
    //             setHistoryList(data);
    //             setIsFirstRequestSent(true);
    //         })
    //         .catch((errorMessage) => notify.error(errorMessage))
    //         .then(() => setLoading(false));
    // };

    const onCancelConfirm = (reservationId) => {
        setLoading(true);
        axios
            .post('Reservation/RevokeByUser', {
                reservationId,
                // status: 7,
                revokeReason: 'Revoke By User',
            })
            .then(({ message }) => {
                notify.success(message);

                let newHistoryList;
                newHistoryList = historyList.map((item) => {
                    if (item.reservationId === reservationId) {
                        return { ...item, presenceStatus: 3 };
                    } else {
                        return item;
                    }
                });

                setHistoryList(newHistoryList);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    let columns = [
        {
            title: 'تاریخ',
            dataIndex: 'dailyProgramShamsiDate',
            key: 'dailyProgramShamsiDate',
        },
        {
            title: 'زمان سانس',
            key: 'startTime',
            render: ({ startTime, endTime }) => `${startTime} - ${endTime}`,
        },
        {
            title: 'وی آی پی',
            key: 'isVip',
            className: 'edit',
            render: (record) =>
                record.isVip ? (
                    <CheckOutlined className="green" />
                ) : (
                    <CloseOutlined className="red" />
                ),
        },
        {
            title: 'وضعیت',
            dataIndex: 'statusReserve',
            key: 'statusReserve',
        },
        {
            title: 'لغو',
            className: 'act-icon delete',
            render: ({ reservationId, presenceStatus }) =>
                presenceStatus === 0 || presenceStatus === 1 ? (
                    <Popconfirm
                        title="مطمئن هستید؟"
                        onConfirm={() => onCancelConfirm(reservationId)}
                    >
                        <CloseSquareOutlined />
                    </Popconfirm>
                ) : (
                    <span style={{ color: '#000' }}>-</span>
                ),
        },
    ];

    const type = url.split('/')[1]?.toUpperCase();

    if (type.toLowerCase() === 'carwash') {
        columns.splice(4, 0, {
            title: 'سرویس ها',
            onCell: ({ reservationId }) => {
                return {
                    onClick: () => {
                        setReservationId(reservationId);
                        setIsModalVisible(true);
                    },
                };
            },
            key: 'reservationId',
            className: 'act-icon edit',
            render: () => <PicRightOutlined style={{ fontSize: 18 }} />,
        });
    }

    useEffect(() => {
        setHistoryList([]);
        setIsFirstRequestSent(false);
        // form.setFieldsValue({
        //     dateFrom: "",
        //     dateTo: "",
        // });
        setLoading(true);
        axios.post('Welfare/Get', { type }).then(({ data }) => {
            const currentWelfareId = data[0].id;

            // if (currentWelfareId == 3) {

            // }
            setWelfareId(currentWelfareId);

            axios
                .post('User/GetHistory', { welfareId: currentWelfareId })
                .then(({ data }) => {
                    setHistoryList(data);
                    setIsFirstRequestSent(true);
                })
                .catch((errorMessage) => notify.error(errorMessage))
                .then(() => setLoading(false));
        });
    }, [url]);

    return (
        <Col sm={24} xs={24} md={20} lg={18} xlg={12}>
            {/* <Card title="انتخاب تاریخ">
                <Row align="center">
                    <Form
                        labelCol={{ xs: 7, md: 6, lg: 5, xlg: 5 }}
                        onFinish={onFinish}
                        scrollToFirstError={true}
                        form={form}
                    >
                        <Form.Item
                            label=""
                            style={{ marginBottom: -20, marginTop: -30 }}
                        >
                            <Form.Item
                                name="dateFrom"
                                label="از تاریخ"
                                rules={[{ required: true }]}
                                style={{
                                    display: "inline-block",
                                    width: "calc(50% - 8px)",
                                }}
                            >
                                <DatePicker
                                    format="YYYY/MM/DD"
                                    calendar={persian}
                                    locale={persian_fa}
                                    weekDays={weekDays}
                                />
                            </Form.Item>

                            <Form.Item
                                name="dateTo"
                                label="تا تاریخ"
                                rules={[{ required: true }]}
                                style={{
                                    display: "inline-block",
                                    width: "calc(50% - 8px)",
                                }}
                            >
                                <DatePicker
                                    format="YYYY/MM/DD"
                                    calendar={persian}
                                    locale={persian_fa}
                                    weekDays={weekDays}
                                />
                            </Form.Item>
                        </Form.Item>

                        <div className="ant-card-footer">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="wide-button"
                                >
                                    مشاهده
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Row>
            </Card> */}

            <Card title="مشاهده تاریخچه">
                <Table
                    bordered
                    columns={columns}
                    pagination={{
                        hideOnSinglePage: true,
                    }}
                    dataSource={historyList}
                    loading={loading}
                    scroll={{ x: true }}
                />
            </Card>

            <Modal
                title="مشاهده سرویس ها"
                visible={isModalVisible}
                footer={null}
                destroyOnClose={true}
                onCancel={() => setIsModalVisible(false)}
            >
                <ShowReservationServices reservationId={reservationId} />
            </Modal>
        </Col>
    );
};

export default ShowUserReservationHistory;
