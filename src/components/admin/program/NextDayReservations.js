import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Modal } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import notify from 'general/notify';
import SetDelayMinutes from 'components/common/reservation/SetDelayMinutes';
import { usePaginate } from 'hooks/usePaginate';
import ShowReservationServices from 'components/common/reservation/ShowReservationServices';
import { PicRightOutlined } from '@ant-design/icons';

const { Option } = Select;

const NextDayReservations = ({ match }) => {
    const [nextDayReservationList, setNextDayReservationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const { url } = match;
    const [welfareId, setWelfareId] = useState(null);
    const [reservationId, setReservationId] = useState(null);
    const [isServicesModalVisible, setIsServicesModalVisible] = useState(false);

    const {
        pageIndex,
        setPageIndex,
        pageSize,
        setPageSize,
        total,
        setTotal,
        paginationData,
    } = usePaginate();

    // columns of table, and values
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
        axios
            .post('Welfare/Get', { type })
            .then(({ data }) => {
                setWelfareId(data[0].id);
                const welfareId = data[0].id;
            })
            .catch((errorMessage) => notify.error(errorMessage));
    }, [url]);

    useEffect(() => {
        if (!welfareId) return;
        axios
            .post('Reservation/GetReservationNextDay', {
                welfareId,
            })
            .then((res) => {
                const { data } = res;
                setNextDayReservationList(data);
                if (total === 0) {
                    setTotal(res.totalrecords);
                }

                setLoading(false);
            })
            .catch((errorMessage) => notify.error(errorMessage));

        // const type = url.split("/")[1]?.toUpperCase();
        // setWelfareId(null);
        // // get welfareId by url
        // axios.post("Welfare/Get", { type }).then(({ data }) => {
        //     const welfareId = data[0].id;
        //     // get reservable days of week
        //     axios
        //         .post("Reservation/GetReservationNextDay", {
        //             welfareId,
        //         })
        //         .then((res) => {
        //             const { data } = res;
        //             setNextDayReservationList(data);
        //             if (total === 0) {
        //                 setTotal(res.totalrecords);
        //             }
        //             setLoading(false);
        //         })
        //         .catch((errorMessage) => notify.error(errorMessage));
        // });
        // try {
        //     let welfareIdToSend;
        //     if (!welfareId) {
        //         let welfareData = await axios.post("Welfare/Get", { type });
        //         welfareIdToSend = welfareData?.data[0].id;
        //         setWelfareId(welfareIdToSend);
        //     } else {
        //         welfareIdToSend = welfareId;
        //     }
        //     axios
        //         .post("Reservation/GetReservationNextDay", {
        //             welfareId: welfareIdToSend,
        //         })
        //         .then((res) => {
        //             const { data } = res;
        //             setNextDayReservationList(data);
        //             if (total === 0) {
        //                 setTotal(res.totalrecords);
        //             }
        //             setLoading(false);
        //         })
        //         .catch((errorMessage) => notify.error(errorMessage));
        // } catch (error) {
        //     console.log(error);
        // }
    }, [welfareId, pageSize, pageIndex]);

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
            let values = {
                reservationId,
                status,
                revokeReason: '',
                delayMinutes,
            };

            delete values.delayMinutes;

            axios
                .post('Reservation/ChangeStatus', values)
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
    // ];

    return (
        <div>
            <Card title="لیست رزروها">
                <Table
                    bordered
                    columns={columns}
                    pagination={paginationData}
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

            <Modal
                title="مشاهده سرویس ها"
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

export default NextDayReservations;
