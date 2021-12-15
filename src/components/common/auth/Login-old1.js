import React, { useState } from "react";
import { Col, Row, Form, Input, Spin, Button, Card } from "antd";
import logo from "images/logo-mci.png";
import axios from "axios";
import { useCookies } from "react-cookie";
import notify from "general/notify";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [, setCookie] = useCookies(["token"]);

    const login = (values) => {
        setLoading(true);
        axios
            .post("User/Login", values)
            .then(({ data, message }) => {
                // check if token property exists
                if (data.token) {
                    setCookie("token", data.token, { path: "/", maxAge:86400 });
                    // notify.success(message);
                }
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <div className="nn">
            <div id="login">
                <Row>
                    <Col xs={24} md={12} className="form-col">
                        <Row
                            justify="center"
                            align="middle"
                            className="login-cols"
                        >
                            <Col className="form">
                                <div className="login-logo">
                                    <img src={logo} />
                                </div>
                                <Spin delay={900} spinning={loading}>
                                    <Form
                                        name="basic"
                                        labelCol={{ sm:8, md:7, lg:6 }}
                                        // wrapperCol={{ span: 16 }}
                                        autoComplete="off"
                                        validateTrigger="onSubmit"
                                        onFinish={login}
                                    >
                                        <Form.Item
                                            label="نام کاربری"
                                            name="username"
                                            rules={[{ required: true }]}
                                        >
                                            <Input size="large" />
                                        </Form.Item>

                                        <Form.Item
                                            label="رمز عبور"
                                            name="password"
                                            rules={[{ required: true }]}
                                        >
                                            <Input.Password />
                                        </Form.Item>
                                        <br />
                                        <br />
                                        <center>
                                            <Form.Item
                                            // wrapperCol={{
                                            //     span: 16,
                                            //     offset:1,
                                            //     xs:{offset: 0},
                                            // }}
                                            >
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    // size="large"
                                                    ghost
                                                    className="wide-button"
                                                    // block
                                                >
                                                    ورود
                                                </Button>
                                            </Form.Item>
                                        </center>
                                    </Form>
                                </Spin>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={0} md={12} className="login-image login-cols">
                        image
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Login;
