import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    Modal,
} from "antd";
import notify from "general/notify";
import { FormOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import AddCluster from "./AddCluster";
import UpdateCluster from "./UpdateCluster";
import { useLocation } from "react-router-dom";
import axios from "axios"

const ClusterSettings = ({welfareId}) => {
    // states
    const [refresh, setRefresh] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [welfareClusterList, setWelfareClusterList] = useState([]);

    const { pathname: url } = useLocation();

    const onSetRefresh = () => {
        setRefresh(!refresh);
    };

    useEffect(() => {
        const type = url.split("/")[1]?.toUpperCase();
        axios.post("WelfareCluster/Get", { welfareType: type })
            .then(({ data }) => {
                setWelfareClusterList(data);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    }, [refresh, url]);

    // const {
    //     dataList: welfareClusterList,
    //     loading,
    //     setLoading,
    // } = useGet(
    //     "/WelfareCluster/Get",
    //     {
    //         welfareId: type,
    //     },
    //     [refresh]
    // );

    // const setNewWelfareClusterList = (cluster) => {
    //     const newwelfareClusterList.map((item) => {
    //         if (item.welfareClusterId === cluster.welfareClusterId) {
    //             return cluster;
    //         }

    //         return item;
    //     });
    // };

    const columns = [
        {
            title: "نام",
            dataIndex: "clusterFa",
            key: "clusterFa",
        },
        {
            title: "گنجایش",
            dataIndex: "clusterCapacity",
            key: "clusterCapacity",
        },
        {
            title: "فعال",
            key: "clusterLock",
            className: "edit",
            render: (record) =>
                !record.clusterLock ? (
                    <CheckOutlined className="green" />
                ) : (
                    <CloseOutlined className="red" />
                ),
        },
        {
            title: "وی آی پی",
            key: "clusterVip",
            className: "edit",
            render: (record) =>
                record.clusterVip ? (
                    <CheckOutlined className="green" />
                ) : (
                    <CloseOutlined className="red" />
                ),
        },
        // {
        //     title: "خانم/آقا",
        //     dataIndex: "genderAcceptance",
        //     key: "genderAcceptance",
        // },
        // {
        //     title: "آدرس",
        //     dataIndex: "address",
        //     key: "address",
        // },
        // {
        //     title: "تلفن",
        //     dataIndex: "tel",
        //     key: "tel",
        // },
        {
            title: "ویرایش",
            className: "act-icon edit",
            onCell: ({
                welfareclusterId,
                clusterFa,
                clusterEn,
                clusterCapacity,
                clusterVip,
                clusterLock,
            }) => {
                return {
                    onClick: () => {
                        setIsUpdateModalVisible(true);
                        setSelectedData({
                            clusterId: welfareclusterId,
                            nameFa: clusterFa,
                            nameEn: clusterEn,
                            capacity: clusterCapacity,
                            isVip: clusterVip,
                            isLocked: clusterLock,
                        });
                    },
                };
            },
            render: () => <FormOutlined />,
        },
    ];

    const showModal = (name) => {
        if (name === "add") {
            setIsAddModalVisible(true);
        } else if (name === "update") {
            setIsUpdateModalVisible(true);
        }
    };

    const handleModalClose = (name) => {
        if (name === "add") {
            setIsAddModalVisible(false);
        } else if (name === "update") {
            setIsUpdateModalVisible(false);
        }
    };

    return (
        <div>
            <div className="add-button-top">
                <Button
                    type="default"
                    size="small"
                    onClick={() => showModal("add")}
                >
                    افزودن مورد جدید
                </Button>
            </div>

            <Table
                bordered
                columns={columns}
                pagination={{
                    hideOnSinglePage: true,
                    // pageSize:10
                }}
                dataSource={welfareClusterList}
                loading={loading}
                scroll={{ x: true }}
            />

            <Modal
                title="افزودن مورد جدید"
                visible={isAddModalVisible}
                footer={null}
                destroyOnClose={true}
                onCancel={() => handleModalClose("add")}
            >
                <AddCluster
                    refreshList={onSetRefresh}
                    welfareId={welfareId}
                    closeModal={handleModalClose}
                />
            </Modal>

            <Modal
                title="ویرایش"
                visible={isUpdateModalVisible}
                footer={null}
                destroyOnClose={true}
                onCancel={() => handleModalClose("update")}
            >
                <UpdateCluster
                    closeModal={handleModalClose}
                    refreshList={onSetRefresh}
                    selectedData={selectedData}
                />
            </Modal>
        </div>
    );
};

export default ClusterSettings;
