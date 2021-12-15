import React, { useState } from "react";
import { Form, Input, Spin, Button, Checkbox } from "antd";
import notify from "general/notify";
import axios from "axios";
import { getNumeric } from "general/Helper";

const UpdateCluster = ({
    selectedData: clusterData,
    refreshList,
    closeModal,
}) => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        values.clusterId = clusterData.clusterId;
        values.isLocked = !values.isLocked;
        axios
            .post("/WelfareCluster/Modify", values)
            .then(({ message }) => {
                setLoading(false);
                notify.success(message);
                refreshList();
                closeModal("update");
            })
            .catch((errorMessage) => notify.error(errorMessage));
    };

    return (
        <Spin delay={900} spinning={loading}>
            <Form
                labelCol={{ xs: 7, md: 6, lg: 5, xlg: 5 }}
                onFinish={onFinish}
                scrollToFirstError={true}
                initialValues={{
                    nameEn: clusterData.nameEn,
                    nameFa: clusterData.nameFa,
                    capacity: clusterData.capacity,
                    isLocked: !clusterData.isLocked,
                    isVip: clusterData.isVip,
                }}
            >
                <Form.Item
                    name="nameFa"
                    label="نام پارسی"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="nameEn"
                    label="نام لاتین"
                    rules={[{ required: true }]}
                >
                    <Input className="ltr" />
                </Form.Item>
                <Form.Item
                    name="capacity"
                    label="گنجایش"
                    rules={[{ required: true }]}
                    normalize={(val) => getNumeric(val)}
                >
                    <Input
                        suffix={<span className="form-postfix-text">نفر</span>}
                        maxLength={5}
                    />
                </Form.Item>

                <Form.Item name="isLocked" label="فعال" valuePropName="checked">
                    <Checkbox></Checkbox>
                </Form.Item>

                <Form.Item
                    name="isVip"
                    label="وی آی پی"
                    valuePropName="checked"
                >
                    <Checkbox></Checkbox>
                </Form.Item>

                <div className="ant-card-modal-footer">
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="wide-button"
                        >
                            ویرایش
                        </Button>
                    </Form.Item>
                </div>
            </Form>
            &nbsp;
        </Spin>
    );
};

export default UpdateCluster;
