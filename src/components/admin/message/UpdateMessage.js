import React, { useState } from "react";
import { Form, Input, Spin, Button } from "antd";
import axios from "axios";
import notify from "general/notify";

const UpdateMessage = ({ messageData, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    // send data to server
    const onFinish = (values) => {
        setLoading(true)
        values.id = messageData.id;
        axios
            .post("Messaging/Modify", values)
            .then(({ message }) => {
                notify.success(message);
                onSuccess(values)
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <Spin delay={900} spinning={loading}>
            <Form
                labelCol={{ xs: 4, md: 4, lg: 3, xlg: 4 }}
                onFinish={onFinish}
                scrollToFirstError={true}
                initialValues={{
                    title: messageData.title,
                    body: messageData.body,
                }}
            >
                <Form.Item
                    name="title"
                    label="عنوان"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="body" label="متن" rules={[{ required: true }]}>
                    <Input.TextArea rows={7} />
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
        </Spin>
    );
};

export default UpdateMessage;
