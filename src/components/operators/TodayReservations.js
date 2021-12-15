import React, { useState, useEffect } from "react";
import { Card, Table, Select, Modal } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import notify from "general/notify";
import SetDelayMinutes from "components/common/reservation/SetDelayMinutes";

const { Option } = Select;

const TodayReservations = ({ match }) => {
    const [todayReservationList, setTodayReservationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);

    useEffect(() => {
        // get reservable days of week
        axios
            .post("Operator/GetTodayReservation")
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
            const uri = status === 2 ? "Entry" : "Absent";
            axios
                .post(`Operator/${uri}`, {
                    reservationId,
                    status,
                    revokeReason: "",
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

    // columns of table, and values
    const columns = [
        {
            title: "نام",
            dataIndex: "namefa",
            key: "namefa",
        },

        {
            title: "کد کارمندی",
            dataIndex: "personelCode",
            key: "personelCode",
        },
        {
            title: "تاریخ",
            dataIndex: "reservationDate",
            key: "reservationDate",
        },
        {
            title: "زمان برنامه",
            dataIndex: "dailyProgramShamsiDate",
            key: "dailyProgramShamsiDate",
        },
        {
            title: "زمان سانس",
            key: "reservationId",
            render: ({ startTime, endTime }) => `${endTime} - ${startTime}`,
        },

        {
            title: "وضعیت",
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

        // {
        //     title: "تایید",
        //     className: "act-icon edit",
        //     render: (record) => {
        //         const active = record.userStatus === "فعال" ? true : false;
        //         return (
        //             <Switch
        //                 size="small"
        //                 checked={active}
        //                 // onChange={(checked, e) =>
        //                 //     onActivityChange(record, checked, e)
        //                 // }
        //             />
        //         );
        //     },
        // },
    ];

    return (
        <div>
            <Card title="لیست رزروهای امروز">
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
                title="حضور"
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
        </div>
    );
};

export default TodayReservations;
