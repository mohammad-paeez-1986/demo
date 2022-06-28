import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Modal } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import notify from 'general/notify';
import SetDelayMinutes from 'components/common/reservation/SetDelayMinutes';
import ShowReservationServices from 'components/common/reservation/ShowReservationServices';
import { PicRightOutlined } from '@ant-design/icons';

const { Option } = Select;

const TodayReservations = ({ match }) => {
    const [todayReservationList, setTodayReservationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const [reservationId, setReservationId] = useState(null);
    const [isServicesModalVisible, setIsServicesModalVisible] = useState(false);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        // columns of table, and values
        const columnsArray = [
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
                title: 'شماره همراه',
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: 'تاریخ ثبت',
                dataIndex: 'reservationDate',
                key: 'reservationDate',
            },
            {
                title: 'زمان برنامه',
                dataIndex: 'dailyProgramShamsiDate',
                key: 'dailyProgramShamsiDate',
            },
            {
                title: 'زمان سانس',
                key: 'reservationId',
                render: ({ startTime, endTime }) => `${endTime} - ${startTime}`,
            },

            {
                title: 'وضعیت',
                render: ({ presenceStatus, reservationId }) => {
                    return (
                        <Select
                            style={{ width: 130 }}
                            value={presenceStatus}
                            onChange={(value) =>
                                onReservationStatusChange(value, reservationId)
                            }
                        >
                            <Option value={0} disabled>
                                در مرحله تائید رزرو
                            </Option>
                            <Option value={1} disabled>
                                تائید رزرو
                            </Option>
                            <Option value={2}>حضور</Option>
                            <Option value={3}>غیبت</Option>
                            <Option value={7} disabled>
                                لغو توسط کاربر
                            </Option>
                            <Option value={8} disabled>
                                رد درخواست
                            </Option>
                            <Option value={9} disabled>
                                لغو توسط سیستم
                            </Option>
                        </Select>
                    );
                },
            },
        ];

        // get profile to add services column
        axios
            .post('User/Profile')
            .then(({ data }) => {
                const { welfareId } = data[0];
                if (welfareId === 3) {
                    columnsArray.splice(4, 0, {
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
                        render: () => (
                            <PicRightOutlined style={{ fontSize: 18 }} />
                        ),
                    });
                } else if (welfareId === 4 || welfareId === 2) {
                    columnsArray.splice(4, 0, {
                        title: 'تعداد همراه',
                        key: 'reservationId',
                        dataIndex: 'companions',
                    });

                    columnsArray.splice(4, 0, {
                        title: welfareId === 4 ? 'عنوان میز' : 'عنوان اتاق',
                        key: 'reservationId',
                        dataIndex: 'welfareClusterNameFa',
                    });
                }

                if (welfareId === 5 ){
                    columnsArray.splice(3, 0, {
                        title: 'نام مشاور',
                        dataIndex: 'welfareClusterNameFa',
                    });
                }
            })
            .finally(() => setColumns(columnsArray));

        // get reservable days of week
        axios
            .post('Operator/GetTodayReservation')
            .then(({ data }) => {
                setTodayReservationList(data);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    }, []);

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const onReservationStatusChange = (
        status,
        reservationId,
        delayMinutes = 0
    ) => {
        if (status !== 2 || delayMinutes) {
            const uri = status === 2 ? 'Entry' : 'Absent';
            axios
                .post(`Operator/${uri}`, {
                    reservationId,
                    status,
                    revokeReason: '',
                    delayMinutes,
                })
                .then(({ message }) => {
                    notify.success(message);
                    const newNextDayReservationList = todayReservationList.map(
                        (item) => {
                            if (item.reservationId === reservationId) {
                                return { ...item, presenceStatus: status };
                            } else {
                                return item;
                            }
                        }
                    );
                    setTodayReservationList(newNextDayReservationList);

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
        <div>
            <Card title='لیست رزروها'>
                <Table
                    bordered
                    columns={columns}
                    pagination={{
                        hideOnSinglePage: true,
                    }}
                    dataSource={todayReservationList}
                    loading={loading}
                    scroll={{ x: true }}
                />
            </Card>
            <Modal
                title='حضور'
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
                title='مشاهده سرویس ها'
                visible={isServicesModalVisible}
                footer={null}
                destroyOnClose={true}
                onCancel={() => setIsServicesModalVisible(false)}
            >
                <ShowReservationServices reservationId={reservationId} />
            </Modal>
        </div>
    );
};

export default TodayReservations;
