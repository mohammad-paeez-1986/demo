import React, { useState, useEffect } from "react";
import { Form, Input, Spin, Button, Radio, Divider } from "antd";
import axios from "axios";
import notify from "general/notify";
import { getNumeric } from "general/Helper";

const Profile = ({ userId }) => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [canEdit, setCanEdit] = useState(false);
    // get initial data for select boxes
    useEffect(() => {
        axios.all([axios.post("User/Profile")]).then((res) => {
            const userData = res[0].data[0];

            if (userData.rolenameen === "ADMIN") {
                setCanEdit(true);
            }

            setUserData(userData);
            setLoading(false);

            const {
                genderId,
                internalNumber,
                namefa,
                nameen,
                personelcode,
                nationalCode,
                mobile,
                email,
                department,
                workgroup,
                rolenamefa,
                username,
                welfareName,
            } = userData;
            form.setFieldsValue({
                nameFa: namefa,
                nameEn: nameen,
                department,
                workgroup,
                personelCode: personelcode,
                nationalCode,
                mobile,
                internalNumber,
                email,
                genderId,
                rolenamefa,
                username,
                welfareName,
            });
        });
    }, []);

    // submit form
    const onFinish = (values) => {
        const requestData = {};
        requestData.nameFa = values.nameFa;
        requestData.nameEn = values.nameEn;
        requestData.mobile = values.mobile;
        requestData.internalNumber = values.internalNumber;
        requestData.email = values.email;

        setLoading(true);
        axios
            .post("User/Modify", requestData)
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
                <Form.Item name="department" label="دپارتمان">
                    <Input readOnly />
                </Form.Item>

                <Form.Item name="workgroup" label="کارگروه">
                    <Input readOnly />
                </Form.Item>

                <Form.Item name="genderId" label="جنسیت">
                    <Radio.Group disabled>
                        <Radio.Button value={1}>مرد</Radio.Button>
                        <Radio.Button value={0}>زن</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="rolenamefa" label="نقش">
                    <Input />
                </Form.Item>
                {userData.roleId === 2 && (
                    <Form.Item name="welfareName" label="بخش">
                        <Input />
                    </Form.Item>
                )}

                <Form.Item name="username" label="نام کاربری">
                    <Input />
                </Form.Item>

                <Form.Item name="personelCode" label="کد کارمندی">
                    <Input className="ltr" readOnly />
                </Form.Item>

                <Form.Item name="nationalCode" label="کد ملی">
                    <Input maxLength={10} className="ltr" readOnly />
                </Form.Item>
                {canEdit ? (
                    <>
                        <Divider orientation="right" className="small-divider">
                            قابل ویرایش
                        </Divider>

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
                            name="internalNumber"
                            label="شماره داخلی"
                            rules={[{ required: true }]}
                            normalize={(val) => getNumeric(val)}
                        >
                            <Input className="ltr" />
                        </Form.Item>

                        <Form.Item
                            name="mobile"
                            label="شماره همراه"
                            rules={[{ required: true }]}
                        >
                            <Input
                                maxLength={11}
                                className="ltr"
                                rules={[{ required: true, size: 11 }]}
                                normalize={(val) => getNumeric(val)}
                            />
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
                    </>
                ) : (
                    <>
                        <Form.Item name="nameFa" label="نام پارسی">
                            <Input readOnly />
                        </Form.Item>

                        <Form.Item name="nameEn" label="نام لاتین">
                            <Input className="ltr" readOnly />
                        </Form.Item>

                        <Form.Item name="internalNumber" label="شماره داخلی">
                            <Input className="ltr" readOnly />
                        </Form.Item>

                        <Form.Item name="mobile" label="شماره همراه">
                            <Input
                                className="ltr"
                                rules={[{ required: true, size: 11 }]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="رایانامه"
                            rules={[{ required: true, type: "email" }]}
                        >
                            <Input className="ltr" readOnly />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Spin>
    );
};

export default Profile;
