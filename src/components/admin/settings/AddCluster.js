import React, { useState } from 'react';
import { Form, Input, Spin, Button, Checkbox, Select, Row, Col } from 'antd';
import notify from 'general/notify';
import axios from 'axios';
import { getNumeric } from 'general/Helper';

const { Option } = Select;

const AddCluster = ({ refreshList, closeModal, welfareId }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        values.welfareId = welfareId;
        values.isLocked = !values.isLocked;
        axios
            .post('/WelfareCluster/New', values)
            .then(({ message }) => {
                setLoading(false);
                notify.success(message);
                refreshList();
                closeModal('add');
            })
            .catch((errorMessage) => notify.error(errorMessage));
    };

    return (
        <Spin delay={900} spinning={loading}>
            <Row align='center'>
                <Col span={18}>
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
                            name='nameFa'
                            label='نام پارسی'
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='nameEn'
                            label='نام لاتین'
                            rules={[{ required: true }]}
                        >
                            <Input className='ltr' />
                        </Form.Item>
                        <Form.Item
                            name='capacity'
                            label='گنجایش'
                            rules={[{ required: true }]}
                            normalize={(val) => getNumeric(val)}
                        >
                            <Input
                                suffix={
                                    <span className='form-postfix-text'>
                                        نفر
                                    </span>
                                }
                                maxLength={5}
                            />
                        </Form.Item>

                        {welfareId === 4 || welfareId === 5 ? (
                            <Form.Item
                                name='genderAcceptanceClusterCode'
                                label='جنسیت'
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Option value={2}>هر دو</Option>
                                    <Option value={0}>خانم</Option>
                                    <Option value={1}>آقا</Option>
                                </Select>
                            </Form.Item>
                        ) : (
                            ''
                        )}

                        <Form.Item
                            name='isLocked'
                            label='فعال'
                            valuePropName='checked'
                        >
                            <Checkbox></Checkbox>
                        </Form.Item>

                        <Form.Item
                            name='isVip'
                            label='وی آی پی'
                            valuePropName='checked'
                        >
                            <Checkbox></Checkbox>
                        </Form.Item>

                        <div className='ant-card-modal-footer'>
                            <Form.Item>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='wide-button'
                                >
                                    ثبت
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Col>
            </Row>
            &nbsp;
        </Spin>
    );
};

export default AddCluster;
