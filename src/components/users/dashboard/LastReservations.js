import React, { useState, useEffect } from "react";
import { Card, Col, Table, Popconfirm } from "antd";
import axios from "axios";
import notify from "general/notify";
import { getWelfareName } from "general/Helper";
import {
    CloseOutlined,
    CheckOutlined,
    CloseSquareOutlined,
} from "@ant-design/icons";

const LastReservations = () => {
    const [loading, setLoading] = useState(true);
    const [lastReservationList, setLastReservationList] = useState([]);
    useEffect(() => {
        axios
            .post("Reservation/GetReservationLastStatus")
            .then(({ data }) => {
                setLastReservationList(data);
            })
            .then(() => setLoading(false));
    }, []);

    const onCancelConfirm = (reservationId) => {
        setLoading(true);
        axios
            .post("Reservation/RevokeByUser", {
                reservationId,
                // status: 7,
                revokeReason: "Revoke By User",
            })
            .then(({ message }) => {
                notify.success(message);

                let newHistoryList;
                newHistoryList = lastReservationList.map((item) => {
                    if (item.reservationId === reservationId) {
                        return { ...item, presenceStatus: 3 };
                    } else {
                        return item;
                    }
                });

                setLastReservationList(newHistoryList);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    const columns = [
        {
            title: "محل",
            key: "reservationId",
            render: ({ welfareId }) => getWelfareName(welfareId),
        },
        {
            title: "تاریخ",
            dataIndex: "dailyProgramShamsiDate",
            key: "dailyProgramShamsiDate",
        },
        {
            title: "زمان سانس",
            key: "startTime",
            render: ({ startTime, endTime }) => `${startTime} - ${endTime}`,
        },
        {
            title: "وی آی پی",
            key: "isVip",
            className: "edit",
            render: (record) =>
                record.isVip ? (
                    <CheckOutlined className="green" />
                ) : (
                    <CloseOutlined className="red" />
                ),
        },
        {
            title: "وضعیت",
            dataIndex: "statusReserve",
            key: "statusReserve",
        },
        {
            title: "لغو",
            className: "act-icon delete",
            render: ({ reservationId, presenceStatus }) =>
                presenceStatus === 0 || presenceStatus === 1 ? (
                    <Popconfirm
                        title="مطمئن هستید؟"
                        onConfirm={() => onCancelConfirm(reservationId)}
                    >
                        <CloseSquareOutlined />
                    </Popconfirm>
                ) : (
                    <span style={{ color: "#000" }}>-</span>
                ),
        },
    ];

    return (
        <Col sm={24} xs={24} md={24} lg={24} xlg={12}>
            <Card title="آخرین رزروها">
                <Table
                    bordered
                    columns={columns}
                    pagination={{
                        hideOnSinglePage: true,
                    }}
                    dataSource={lastReservationList}
                    // loading={loading}
                    scroll={{ x: true }}
                />
            </Card>
        </Col>
    );
};

export default LastReservations;
