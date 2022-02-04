import React, { useState, useEffect } from "react";
import { Form, Input, Spin, Button, Select, Radio } from "antd";
import axios from "axios";
import notify from "general/notify";
import {
    getNumeric,
    isMobile,
    isNationalCode,
} from "general/Helper";

const { Option } = Select;

const UpdateUser = ({ userId }) => {
    const [departmentList, setDepartmentList] = useState([]);
    const [workGroupList, setWorkGroupList] = useState([]);
    const [userData, setUserData] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    // get initial data for select boxes
    useEffect(() => {
        axios
            .all([
                axios.post("User/GetRoles"),
                axios.post("Department/Get"),
                axios.post("Workgroup/Get"),
                axios.post("User/Get", { userId }),
            ])
            .then((res) => {
                setRoleList(res[0].data);
                setDepartmentList(res[1].data);
                setWorkGroupList(res[2].data);

                const userData = res[3].data[0];
                console.log(res[3].data);
                setUserData(userData);
                setLoading(false);

                // initialize form
                if (res[3].data[0]) {
                    const {
                        genderId,
                        internalNumber,
                        namefa,
                        nameen,
                        personelcode,
                        nationalCode,
                        mobile,
                        email,
                        departmentId,
                        workgroupId,
                        rolenamefa,
                        roleId,
                        username,
                        welfareName,
                    } = userData;

                    form.setFieldsValue({
                        nameFa: namefa,
                        nameEn: nameen,
                        departmentId,
                        workGroupId: workgroupId,
                        personelCode: personelcode,
                        nationalCode,
                        mobile,
                        internalNumber,
                        email,
                        gender: genderId,
                        rolenamefa,
                        username,
                        role: roleId,
                        welfareName,
                    });
                }
            });
    }, []);

    // submit form
    const onFinish = (values) => {
        values.userId = userId;

        // delete values.username;
        delete values.welfareName;

        setLoading(true);
        axios
            .post("User/ModifyByAdmin", values)
            .then(({ message }) => {
                notify.success(message);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <Spin delay={900} spinning={loading}>
            <br />
            <Form
                labelCol={{ xs: 7, md: 6, lg: 5, xlg: 5 }}
                onFinish={onFinish}
                scrollToFirstError={true}
                form={form}
            >
                <Form.Item name="role" label="نقش">
                    <Select>
                        {roleList.map(({ id, roleNameFa }) => (
                            <Option value={id}>{roleNameFa}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {userData?.roleId === 2 && (
                    <Form.Item
                        name="welfareName"
                        label="بخش"
                        // rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="departmentId"
                    label="دپارتمان"
                    rules={[{ required: true }]}
                >
                    <Select>
                        {departmentList?.map(({ id, nameFa }) => (
                            <Option value={id}>{nameFa}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="workGroupId"
                    label="کارگروه"
                    rules={[{ required: true }]}
                >
                    <Select>
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
                    name="username"
                    label="نام کاربری"
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
                                    return Promise.reject("کد ملی معتبر نیست");
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
                    rules={[
                        {
                            required: true,
                            size: 11,
                            validator(_, value) {
                                if (isMobile(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject(
                                        "شماره همراه معتبر نیست"
                                    );
                                }
                            },
                        },
                    ]}
                    normalize={(val) => getNumeric(val)}
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
                    rules={[{ required: true, type: "email" }]}
                >
                    <Input className="ltr" />
                </Form.Item>

                <div className="ant-card-footer">
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

export default UpdateUser;
