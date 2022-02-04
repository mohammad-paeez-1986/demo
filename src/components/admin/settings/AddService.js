import React, { useState, useEffect } from 'react';
import { Button, Form, Spin, Input, Textarea } from 'antd';
import { getNumeric } from 'general/Helper';
import axios from 'axios';
import notify from 'general/notify';

const { TextArea } = Input;

const AddServiceModal = ({ welfareId, closeModal, getData, serviceData }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (serviceData) {
            const { serviceName, price, comment } = serviceData;

            form.setFieldsValue({
                serviceName,
                price,
                comment,
            });
        }
    }, []);

    const onFinish = (values) => {
        values.welfareId = welfareId;

        // edit
        let uri;
        if (!serviceData) {
            uri = 'New';
        } else {
            values.id = serviceData.id;
            values.isActive = true
            uri = 'Modify';
        }

        setLoading(true);
        axios
            .post(`WelfareServices/${uri}`, values)
            .then(({ message }) => {
                notify.success(message);
                closeModal();
                getData();
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <>
            <Spin delay={900} spinning={loading}>
                <Form
                    labelCol={{ xs: 7, md: 6, lg: 5, xlg: 5 }}
                    onFinish={onFinish}
                    scrollToFirstError={true}
                    form={form}
                >
                    <Form.Item
                        name="serviceName"
                        label="عنوان"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="قیمت"
                        rules={[{ required: true }]}
                        normalize={(val) => getNumeric(val)}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="شرح"
                        rules={[{ required: true }]}
                    >
                        <TextArea />
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
            </Spin>
        </>
    );
};

export default AddServiceModal;
