import React, { useState, useEffect } from 'react';
import { Form, Input, Spin, Button, TimePicker } from 'antd';
import notify from 'general/notify';
import axios from 'axios';
import { getNumeric } from 'general/Helper';
import moment from 'moment';

const format = 'HH:mm';

const GeneralSettings = ({ welfareId }) => {
    const [, setSettingData] = useState({});
    // const [loading, setLoading] = useState(true)
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        axios
            .post('WelfareSetting/GetLast', { welfareId })
            .then(({ data }) => {
                setSettingData(data);
                const {
                    alloweTimes,
                    maximumCapacity,
                    programGapTimeMinutes,
                    programTimeMinutes,
                    reserveDaysBefore,
                    reserveTimeFrom,
                    reserveTimeTo,
                    revokeTimeTo,
                    dailyAllowedTimes,
                } = data;
                form.setFieldsValue({
                    reserveTime: [
                        reserveTimeFrom && moment(reserveTimeFrom, 'HH:mm'),
                        reserveTimeFrom && moment(reserveTimeTo, 'HH:mm'),
                    ],
                    revokeTimeTo: revokeTimeTo && moment(revokeTimeTo, 'HH:mm') ,
                    alloweTimes,
                    maximumCapacity,
                    programGapTimeMinutes,
                    programTimeMinutes,
                    reserveDaysBefore,
                    dailyAllowedTimes,
                });
            })
            // .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    }, [welfareId]);

    const onFinish = (values) => {
        values.revokeTimeTo = values.revokeTimeTo.format('HH:mm');
        values.reserveTimeFrom = values.reserveTime[0].format('HH:mm');
        values.reserveTimeTo = values.reserveTime[1].format('HH:mm');
        values.welfareId = welfareId;
        values.vipWorkgroupId = [];
        values.vipPersonelCode = [];
        // delete values.reserveTime;

        axios
            .post('WelfareSetting/New', values)
            .then(({ message }) => {
                notify.success(message);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <div>
            <br />
            <Spin delay={900} spinning={loading}>
                <Form
                    labelCol={{ xs: 11, sm: 10, md: 8, lg: 8, xlg: 5 }}
                    wrapperCol={{ xs: 12, md: 12, lg: 10, xlg: 5 }}
                    onFinish={onFinish}
                    scrollToFirstError={true}
                    form={form}
                    // initialValues={{

                    //     maximumCapacity: 10,
                    // }}
                >
                    <Form.Item
                        name='reserveTime'
                        label='???????? ????????'
                        rules={[{ required: true }]}
                    >
                        <TimePicker.RangePicker
                            style={{ width: '100%' }}
                            defaultValue={moment('12:08', format)}
                            format={format}
                        />
                    </Form.Item>

                    <Form.Item
                        name='revokeTimeTo'
                        label='???????? ?????????? ????'
                        rules={[{ required: true }]}
                    >
                        <TimePicker
                            style={{ width: '100%' }}
                            defaultValue={moment('12:08', format)}
                            format={format}
                        />
                    </Form.Item>

                    <Form.Item
                        name='maximumCapacity'
                        label='????????????'
                        rules={[{ required: true }]}
                        normalize={(val) => getNumeric(val)}
                    >
                        <Input
                            suffix={
                                <span className='form-postfix-text'>??????</span>
                            }
                            maxLength={5}
                        />
                    </Form.Item>
                    <Form.Item
                        name='alloweTimes'
                        label='?????????? ???????? ??????????????'
                        rules={[{ required: true }]}
                        normalize={(val) => getNumeric(val)}
                    >
                        <Input
                            suffix={
                                <span className='form-postfix-text'>??????</span>
                            }
                            maxLength={5}
                        />
                    </Form.Item>

                    <Form.Item
                        className='sm-font'
                        name='reserveDaysBefore'
                        label='?????????? ???????????? ???????? ?????? ???? ????????'
                        rules={[{ required: true }]}
                        normalize={(val) => getNumeric(val)}
                    >
                        <Input
                            suffix={
                                <span className='form-postfix-text'>??????</span>
                            }
                            maxLength={5}
                        />
                    </Form.Item>

                    {welfareId === 2 && (
                        <Form.Item
                            className='sm-font'
                            name='dailyAllowedTimes'
                            label='?????????? ?????????? ???????? ???????? ????????????'
                            rules={[
                                {
                                    required: true,
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (value && (value == 2 || value == 1)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                '?????????? ?????????????? 1 ???? 2 ????????'
                                            )
                                        );
                                    },
                                }),
                            ]}
                            normalize={(val) => getNumeric(val)}
                        >
                            <Input
                                suffix={
                                    <span className='form-postfix-text'>
                                        ??????
                                    </span>
                                }
                                maxLength={2}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        name='programTimeMinutes'
                        label='???????????? ?????????? ???? ????????'
                        rules={[{ required: true }]}
                        normalize={(val) => getNumeric(val)}
                    >
                        <Input
                            suffix={
                                <span className='form-postfix-text'>??????????</span>
                            }
                            maxLength={5}
                        />
                    </Form.Item>

                    <Form.Item
                        name='programGapTimeMinutes'
                        label='?????????? ?????????? ?????? ???? ????????'
                        rules={[{ required: true }]}
                        normalize={(val) => getNumeric(val)}
                    >
                        <Input
                            suffix={
                                <span className='form-postfix-text'>??????????</span>
                            }
                            maxLength={5}
                        />
                    </Form.Item>

                    <div className='ant-card-tab-footer'>
                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button
                                type='primary'
                                htmlType='submit'
                                className='wide-button'
                            >
                                ??????
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Spin>
        </div>
    );
};

export default GeneralSettings;
