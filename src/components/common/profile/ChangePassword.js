import React, { useState } from "react";
import { Spin, Form, Input, Button } from "antd";
import axios from "axios";
import notify from "general/notify";

const UpdatePassword = () => {
    const [loading, setLoading] = useState(false);

    // submit form
    const onFinish = (values) => {
        setLoading(true);
        axios
            .post("User/ChangePassword", values)
            .then(({ message }) => {
                notify.success(message);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <div>
            <Spin delay={900} spinning={loading}>
                <Form
                    labelCol={{ xs: 7, md: 6, lg: 5, xlg: 5 }}
                    scrollToFirstError={true}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="oldPassword"
                        label="رمز عبور سابق"
                        rules={[{ required: true }]}
                    >
                        <Input.Password className="ltr"/>
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="رمز عبور جدید"
                        rules={[{ required: true }]}
                    >
                        <Input.Password className="ltr"/>
                    </Form.Item>
                    <div className="ant-card-footer">
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="wide-button"
                            >
                                تغییر
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Spin>
        </div>
    );
};

export default UpdatePassword;
