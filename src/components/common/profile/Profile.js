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
                <Form.Item name="department" label="????????????????">
                    <Input readOnly />
                </Form.Item>

                <Form.Item name="workgroup" label="??????????????">
                    <Input readOnly />
                </Form.Item>

                <Form.Item name="genderId" label="??????????">
                    <Radio.Group disabled>
                        <Radio.Button value={1}>??????</Radio.Button>
                        <Radio.Button value={0}>????????</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="rolenamefa" label="??????">
                    <Input />
                </Form.Item>
                {userData.roleId === 2 && (
                    <Form.Item name="welfareName" label="??????">
                        <Input />
                    </Form.Item>
                )}

                <Form.Item name="username" label="?????? ????????????">
                    <Input />
                </Form.Item>

                <Form.Item name="personelCode" label="???? ??????????????">
                    <Input className="ltr" readOnly />
                </Form.Item>

                <Form.Item name="nationalCode" label="???? ??????">
                    <Input maxLength={10} className="ltr" readOnly />
                </Form.Item>
                {canEdit ? (
                    <>
                        <Divider orientation="right" className="small-divider">
                            ???????? ????????????
                        </Divider>

                        <Form.Item
                            name="nameFa"
                            label="?????? ??????????"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="nameEn"
                            label="?????? ??????????"
                            rules={[{ required: true }]}
                        >
                            <Input className="ltr" />
                        </Form.Item>

                        <Form.Item
                            name="internalNumber"
                            label="?????????? ??????????"
                            rules={[{ required: true }]}
                            normalize={(val) => getNumeric(val)}
                        >
                            <Input className="ltr" />
                        </Form.Item>

                        <Form.Item
                            name="mobile"
                            label="?????????? ??????????"
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
                            label="????????????????"
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
                                    ????????????
                                </Button>
                            </Form.Item>
                        </div>
                    </>
                ) : (
                    <>
                        <Form.Item name="nameFa" label="?????? ??????????">
                            <Input readOnly />
                        </Form.Item>

                        <Form.Item name="nameEn" label="?????? ??????????">
                            <Input className="ltr" readOnly />
                        </Form.Item>

                        <Form.Item name="internalNumber" label="?????????? ??????????">
                            <Input className="ltr" readOnly />
                        </Form.Item>

                        <Form.Item name="mobile" label="?????????? ??????????">
                            <Input
                                className="ltr"
                                rules={[{ required: true, size: 11 }]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="????????????????"
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
