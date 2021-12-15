import React, { useState, useEffect } from "react";
import {
    Card,
    Table,
    Select,
    Modal
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import notify from "general/notify";
import SetDelayMinutes from 'components/common/reservation/SetDelayMinutes';

const { Option } = Select;

const NextDayReservations = ({ match }) => {
    const [nextDayReservationList, setNextDayReservationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const { url } = match;

    useEffect(() => {
        const type = url.split("/")[1]?.toUpperCase();
        // get welfareId by url
        axios.post("Welfare/Get", { type }).then(({ data }) => {
            const welfareId = data[0].id;

            // get reservable days of week
            axios
                .post("Reservation/GetReservationNextDay", {
                    welfareId,
                })
                .then(({ data }) => {
                    setNextDayReservationList(data);
                    setLoading(false);
                })
                .catch((errorMessage) => notify.error(errorMessage));
        });
    }, [url]);

    // const getReservationStatus = () => {
    //     let statusText;
    //     switch (id) {
    //         case 0:
    //             statusText = "در مرحله تائید رزرو";
    //             break;
    //         case 1:
    //             statusText = "تایید رزرو";
    //             break;
    //         case 2:
    //             statusText = "حضور";
    //             break;
    //         case 3:
    //             statusText = "غیبت";
    //             break;
    //         case 8:
    //             statusText = "رد درخواست";
    //             break;
    //     }

    //     return statusText;
    // };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const onReservationStatusChange = (
        status,
        reservationId,
        delayMinutes = false
    ) => {
        if (status !== 2 || delayMinutes) {
            axios
                .post("Reservation/ChangeStatus", {
                    reservationId,
                    status,
                    revokeReason: "",
                    delayMinutes,
                })
                .then(({ message }) => {
                    notify.success(message);
                    const newNextDayReservationList =
                        nextDayReservationList.map((item) => {
                            if (item.reservationId === reservationId) {
                                return { ...item, presenceStatus: status };
                            } else {
                                return item;
                            }
                        });
                    setNextDayReservationList(newNextDayReservationList);

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
            <Card title="لیست رزروهای روز آتی">
                <Table
                    bordered
                    columns={columns}
                    pagination={{
                        hideOnSinglePage: true,
                    }}
                    dataSource={nextDayReservationList}
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

export default NextDayReservations;
