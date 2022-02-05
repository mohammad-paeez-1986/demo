import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import notify from 'general/notify';
import axios from 'axios';
import { formatNumber } from 'general/Helper';

const ShowReservationServices = ({ reservationId }) => {
    const [servicesData, setServicesData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .post('/Reservation/GetReservationServices', { reservationId })
            .then(({ data }) => {
                setServicesData(data);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    }, []);

    const columns = [
        {
            title: 'عنوان',
            dataIndex: 'serviceName',
            key: 'serviceName',
        },
        {
            title: 'قیمت',
            key: 'price',
            render: ({ price }) => {
                return formatNumber(price);
            },
        },
        {
            title: 'شرح',
            dataIndex: 'comment',
            key: 'comment',
        },
       
    ];

    return (
        <div>
            <Table
                bordered
                columns={columns}
                pagination={{
                    hideOnSinglePage: true,
                }}
                dataSource={servicesData}
                loading={loading}
                scroll={{ x: true }}
            />
        </div>
    );
};

export default ShowReservationServices;
