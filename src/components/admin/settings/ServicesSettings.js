import React, { useState, useEffect } from 'react';
import { Button, Space, Form, Modal, Table, Spin, Popconfirm } from 'antd';
import notify from 'general/notify';
import axios from 'axios';
import AddService from './AddService';
import { formatNumber } from 'general/Helper';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const CarwashServicesSettings = ({ welfareId }) => {
    const [settingsData, setSettingsData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [serviceData, setServiceData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getData = () => {
        axios
            .post('WelfareServices/Get', { welfareId })
            .then(({ data }) => {
                setSettingsData(data);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    useEffect(() => {
        getData();
    }, []);

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const onDeleteService = (id) => {
        setLoading(true);
        axios
            .post('WelfareServices/Modify', { id, isActive: false })
            .then(({ data }) => {
                let newSettingsData = [];
                newSettingsData = settingsData.filter((data) => data.id !== id);
                setSettingsData(newSettingsData);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

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
        {
            title: 'ویرایش',
            className: 'act-icon edit',
            onCell: (record) => {
                return {
                    onClick: () => {
                        setIsModalVisible(true);
                        setServiceData(record);
                    },
                };
            },
            render: ({ id }) => <EditOutlined />,
        },
        {
            title: 'حذف',
            className: 'act-icon delete',
            render: ({ id }) => (
                <Popconfirm
                    title="آیا مطمئن هستید؟"
                    onConfirm={() => onDeleteService(id)}
                >
                    <DeleteOutlined />
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <Space>
                <Button
                    type="secondary"
                    ghost
                    className="ghost float-left"
                    size="small"
                    onClick={() => {
                        setServiceData(null);
                        setIsModalVisible(true);
                    }}
                >
                    افزودن خدمت
                </Button>
            </Space>
            <Table
                bordered
                columns={columns}
                pagination={{
                    hideOnSinglePage: true,
                }}
                dataSource={settingsData}
                loading={loading}
                scroll={{ x: true }}
            />

            <Modal
                title={!serviceData ? 'افزودن خدمت' : 'ویرایش خدمت'}
                visible={isModalVisible}
                footer={null}
                destroyOnClose={true}
                onCancel={closeModal}
            >
                <AddService
                    closeModal={closeModal}
                    welfareId={welfareId}
                    getData={getData}
                    serviceData={serviceData}
                />
            </Modal>
        </>
    );
};

export default CarwashServicesSettings;
