import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col, Spin } from "antd";
import logo from "images/sm-mci-logo.png";
import axios from "axios";
import { useCookies } from "react-cookie";
import notify from "general/notify";

const Login = () => {
    const [spinning, setSpinning] = useState(false);
    const [, setCookie] = useCookies(["token"]);

    const login = (values) => {
        axios
            .post("User/Login", values)
            .then(({ data, message }) => {
                // check if token property exists
                if (data.token) {
                    setCookie("token", data.token, { path: "/" });
                    notify.success(message);
                }
            })
            .catch((errorMessage) => notify.error(errorMessage));
    };

    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            <div className="top-nav">سامانه نوبت دهی همراه اول</div>
            <Row align="center" className="mt">
                <Col xs={20} sm={18} md={14} lg={10}>
                    {/* <div className="logo">
            <img src={logo} />
          </div> */}

                    <Card title="ورود به پنل کاربری" className="login-card">
                        <Spin delay={900} spinning={spinning}>
                            <Form
                                name="basic"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                autoComplete="off"
                                validateTrigger="onSubmit"
                                onFinish={login}
                            >
                                <Form.Item
                                    label="نام کاربری"
                                    name="username"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="رمز عبور"
                                    name="password"
                                    rules={[{ required: true }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <div className="ant-card-footer">
                                    <Form.Item wrapperCol={{ span: 24 }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            className="wide-button"
                                        >
                                            ورود
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Form>
                        </Spin>
                    </Card>
                </Col>
            </Row>
            <div className="bottom-nav">
                <p className="p">همراه اول</p>
            </div>
        </div>
    );
};

export default Login;
