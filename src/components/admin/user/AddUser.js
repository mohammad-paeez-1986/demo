import React, { useState, useEffect } from 'react';
import { Card, Col, Form, Input, Spin, Button, Select, Radio } from 'antd';
import axios from 'axios';
import notify from 'general/notify';
import { getNumeric, isMobile, isNationalCode } from 'general/Helper';

const { Option } = Select;

const AddUser = () => {
    const [roleList, setRoleList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [workGroupList, setWorkGroupList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRoleOperator, setIsRoleOperator] = useState(false);
    const [welfareList, setWelfareList] = useState([]);
    const [form] = Form.useForm();

    // get initial data for select boxes
    useEffect(() => {
        axios
            .all([
                axios.post('Department/Get'),
                axios.post('Workgroup/Get'),
                axios.post('User/GetRoles'),
            ])
            .then((res) => {
                setDepartmentList(res[0].data);
                setWorkGroupList(res[1].data);
                setRoleList(res[2].data);
                setLoading(false);
            });
    }, []);

    // submit form
    const onFinish = (values) => {
        const { username, role, password, welfareId } = values;
        delete values.username;
        delete values.password;
        delete values.role;
        delete values.welfareId;

        let data = { username, role, password, welfareId };
        data.PersonelInfo = values;
        setLoading(true);
        axios
            .post('User/NewUserPersonel', data)
            .then(({ message }) => {
                notify.success(message);

                // reset fields
                form.resetFields();
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    const onRoleChange = (value) => {
        if (value === 2) {
            setIsRoleOperator(true);
            setLoading(true);

            if (!welfareList.length) {
                axios
                    .post('Welfare/Get', { type: null })
                    .then(({ data }) => {
                        setWelfareList(data);
                    })
                    .catch((errorMessage) => notify.error(errorMessage))
                    .then(() => setLoading(false));
            }
        } else {
            setIsRoleOperator(false);
        }
    };

    const rule = (val) => {
        return val > 1 ? true : false;
    };

    return (
        <Col sm={24} xs={24} md={19} lg={15} xlg={12}>
            <Card title="ثبت کاربر جدید">
                <Spin delay={900} spinning={loading}>
                    <div className="form-part-title">اطلاعات پرسنلی</div>
                    <Form
                        labelCol={{ xs: 7, md: 6, lg: 6, xlg: 5 }}
                        onFinish={onFinish}
                        scrollToFirstError={true}
                        autoComplete="off"
                        initialValues={{
                            gender: 1,
                        }}
                        form={form}
                    >
                        <Form.Item
                            name="role"
                            label="نقش"
                            rules={[{ required: true }]}
                        >
                            <Select onChange={onRoleChange}>
                                {roleList.map(({ id, roleNameFa }) => (
                                    <Option value={id}>{roleNameFa}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {isRoleOperator && (
                            <Form.Item
                                name="welfareId"
                                label="بخش"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    {welfareList.map(({ id, typename }) => (
                                        <Option value={id}>{typename}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}

                        <Form.Item
                            name="departmentId"
                            label="دپارتمان"
                            rules={[{ required: true }]}
                        >
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children
                                        .toLowerCase()
                                        .localeCompare(
                                            optionB.children.toLowerCase()
                                        )
                                }
                            >
                                {departmentList.map(({ id, nameFa }) => (
                                    <Option value={id}>{nameFa}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="workGroupId"
                            label="کارگروه"
                            rules={[{ required: true }]}
                        >
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children
                                        .toLowerCase()
                                        .localeCompare(
                                            optionB.children.toLowerCase()
                                        )
                                }
                            >
                                {workGroupList.map(({ id, nameFa }) => (
                                    <Option value={id}>{nameFa}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="جنسیت"
                            rules={[{ required: true }]}
                        >
                            <Radio.Group>
                                <Radio.Button value={1}>مرد</Radio.Button>
                                <Radio.Button value={0}>زن</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

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
                            name="personelCode"
                            label="کد کارمندی"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            normalize={(val) => getNumeric(val)}
                        >
                            <Input className="ltr" />
                        </Form.Item>

                        <Form.Item
                            name="nationalCode"
                            label="کد ملی"
                            rules={[
                                {
                                    required: true,
                                    validator(_, value) {
                                        if (isNationalCode(value)) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(
                                                'کد ملی معتبر نیست'
                                            );
                                        }
                                    },
                                },
                            ]}
                            normalize={(val) => getNumeric(val)}
                        >
                            <Input maxLength={10} className="ltr" />
                        </Form.Item>

                        <Form.Item
                            name="mobile"
                            label="شماره همراه"
                            normalize={(val) => getNumeric(val)}
                            rules={[
                                {
                                    required: true,
                                    validator(_, value) {
                                        if (isMobile(value)) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(
                                                'شماره همراه معتبر نیست'
                                            );
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input maxLength={11} className="ltr" />
                        </Form.Item>

                        <Form.Item
                            name="internalNumber"
                            label="شماره داخلی"
                            rules={[{ required: true }]}
                            normalize={(val) => getNumeric(val)}
                        >
                            <Input className="ltr" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="رایانامه"
                            rules={[{ required: true, type: 'email' }]}
                        >
                            <Input className="ltr" />
                        </Form.Item>
                        <br />
                        <br />
                        <div className="form-part-title">
                            اطلاعات احراز هویت
                        </div>
                        <Form.Item
                            name="username"
                            label="نام کاربری"
                            rules={[{ required: true }]}
                        >
                            <Input className="ltr-left" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="رمز عبور"
                            rules={[{ required: true }]}
                        >
                            <Input.Password className="ltr" />
                        </Form.Item>

                        <div className="ant-card-footer">
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
            </Card>
        </Col>
    );
};

export default AddUser;
