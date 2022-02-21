import React, { useState, useEffect } from 'react';
import {
    Row,
    Card,
    Col,
    Form,
    Input,
    Spin,
    Button,
    Table,
    Select,
    Modal,
} from 'antd';
import notify from 'general/notify';
import axios from 'axios';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { getDateFromObject } from 'general/Helper';
import SetDelayMinutes from 'components/common/reservation/SetDelayMinutes';
import { usePaginate } from 'hooks/usePaginate';
import ShowReservationServices from 'components/common/reservation/ShowReservationServices';
import { PicRightOutlined } from '@ant-design/icons';

const { Option } = Select;

const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

const ShowReservationHistory = ({ match }) => {
    const [loading, setLoading] = useState(false);
    const [welfareId, setWelfareId] = useState(null);
    const [historyList, setHistoryList] = useState([]);
    const [isFirstRequestSent, setIsFirstRequestSent] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const [form] = Form.useForm();
    const { url } = match;
    const [reservationId, setReservationId] = useState(null);
    const [isServicesModalVisible, setIsServicesModalVisible] = useState(false);

    const onFinish = (values) => {
        values.welfareId = welfareId;
        values.userId = 0;
        values.dateFrom = getDateFromObject(values.dateFrom);
        values.dateTo = getDateFromObject(values.dateTo);

        if (values.dateTo < values.dateFrom) {
            notify.error('تاریخ پایان نمیتواند قبل از تاریخ شروع باشد');
            return;
        }

        setLoading(true);
        axios
            .post('/User/GetUserHistory', { pageIndex, pageSize, ...values })
            .then((res) => {
                const { data } = res;
                setHistoryList(data);
                if (isFirstRequestSent === false) {
                    setIsFirstRequestSent(true);
                }
                if (total === 0) {
                    setTotal(res.totalrecords);
                }
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    const {
        pageIndex,
        setPageIndex,
        pageSize,
        setPageSize,
        total,
        setTotal,
        paginationData,
    } = usePaginate(form.submit);

    const columns = [
        {
            title: 'نام',
            dataIndex: 'namefa',
            key: 'namefa',
        },
        {
            title: 'کد کارمندی',
            dataIndex: 'personelCode',
            key: 'personelCode',
        },
        {
            title: 'تاریخ',
            dataIndex: 'dailyProgramShamsiDate',
            key: 'dailyProgramShamsiDate',
        },
        {
            title: 'زمان سانس',
            key: 'startTime',
            render: ({ startTime, endTime }) => `${endTime} - ${startTime}`,
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
        // {
        //     title: "وضعیت",
        //     dataIndex: "statusReserve",
        //     key: "statusReserve",
        // },
        {
            title: 'وضعیت',
            render: ({ presenceStatus, reservationId }) => {
                return (
                    <Select
                        style={{ width: 130 }}
                        defaultValue={presenceStatus}
                        onChange={(id) =>
                            onReservationStatusChange(id, reservationId)
                        }
                        disabled={presenceStatus === 7}
                    >
                        <Option value={0}>در مرحله تائید رزرو</Option>
                        <Option value={1}>تائید رزرو</Option>
                        <Option value={2}>حضور</Option>
                        <Option value={3}>غیبت</Option>
                        <Option value={7} disabled>
                            لغو توسط کاربر
                        </Option>
                        <Option value={8}>رد درخواست</Option>
                        <Option value={9} disabled>
                            لغو توسط سیستم
                        </Option>
                    </Select>
                );
            },
        },
        // {
        //     title: "کاربر",
        //     dataIndex: "userId",
        //     key: "userId",
        // },
    ];

    const type = url.split('/')[1]?.toUpperCase();

    if (type === 'CARWASH') {
        columns.splice(4, 0, {
            title: 'سرویس ها',
            onCell: ({ reservationId }) => {
                return {
                    onClick: () => {
                        setReservationId(reservationId);
                        setIsServicesModalVisible(true);
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
        form.setFieldsValue({
            dateFrom: '',
            dateTo: '',
        });
        const type = url.split('/')[1]?.toUpperCase();
        axios.post('Welfare/Get', { type }).then(({ data }) => {
            // console.log(data);
            setWelfareId(data[0].id);
        });
    }, [url]);

    const closeModal = () => {
        setIsModalVisible(false);
    };

    // const onReservationStatusChange = (status, reservationId) => {
    //     // get reservable days of week
    //     axios
    //         .post("Reservation/ChangeStatus", {
    //             reservationId,
    //             status,
    //             revokeReason: "",
    //         })
    //         .then(({ message }) => {
    //             notify.success(message);
    //         })
    //         .catch((errorMessage) => notify.error(errorMessage));
    // };

    const onReservationStatusChange = (
        status,
        reservationId,
        isPresenceHour = false
    ) => {
        if (status !== 2 || isPresenceHour) {
            axios
                .post('Reservation/ChangeStatus', {
                    reservationId,
                    status,
                    revokeReason: '',
                })
                .then(({ message }) => {
                    notify.success(message);
                    const newHistoryList = historyList.map((item) => {
                        if (item.reservationId === reservationId) {
                            return { ...item, presenceStatus: status };
                        } else {
                            return item;
                        }
                    });
                    setHistoryList(newHistoryList);

                    if (isModalVisible) {
                        setIsModalVisible(false);
                    }
                })
                .catch((errorMessage) => notify.error(errorMessage));
        } else {
            setSelectedReservationId(reservationId);
            setIsModalVisible(true);
        }
    };

    return (
        <Col sm={24} xs={24} md={22} lg={20} xlg={12}>
            <Card title="انتخاب تاریخ">
                <Spin delay={900} spinning={loading}>
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
                                        display: 'inline-block',
                                        width: 'calc(50% - 8px)',
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
                                        display: 'inline-block',
                                        width: 'calc(50% - 8px)',
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
                </Spin>
            </Card>
            {isFirstRequestSent ? (
                <Card title="مشاهده تاریخچه">
                    <Table
                        bordered
                        columns={columns}
                        pagination={paginationData}
                        dataSource={historyList}
                        loading={loading}
                        scroll={{ x: true }}
                    />
                </Card>
            ) : null}
            <Modal
                title="ورود میزان تاخیر"
                visible={isModalVisible}
                footer={null}
                destroyOnClose={true}
                onCancel={closeModal}
            >
                <SetDelayMinutes
                    onReservationStatusChange={onReservationStatusChange}
                    closeModal={closeModal}
                    reservationId={selectedReservationId}
                />
            </Modal>
            <Modal
                title="مشاهده سرویس ها"
                visible={isServicesModalVisible}
                footer={null}
                destroyOnClose={true}
                onCancel={() => setIsServicesModalVisible(false)}
            >
                <ShowReservationServices reservationId={reservationId} />
            </Modal>
        </Col>
    );
};

export default ShowReservationHistory;
