import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import notify from "general/notify";
import axios from "axios";

const AddHolliday = ({ date, closeModal }) => {
    const [loading, setLoading] = useState(true);

    const onFinish = (values) => {
        values.shamsiDate = date;
        delete values.time;

        setLoading(true);
        axios
            .post("Calendar/New", values)
            .then(({ message }) => {
                notify.success(message);
                // onSetNewProgram(date, true);
                closeModal();
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <div>
            <Form
                labelCol={{ xs: 7, md: 6, lg: 5, xlg: 5 }}
                onFinish={onFinish}
                scrollToFirstError={true}
                initialValues={{
                    isLocked: false,
                    isVip: false,
                }}
            >
                <Form.Item
                    name="description"
                    label="شرح"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <div className="ant-card-modal-footer">
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="wide-button"
                        >
                            ثبت
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default AddHolliday;
