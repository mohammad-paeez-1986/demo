import React, { useState, useEffect } from 'react';
import { Col, Row, Form, Input, Spin, Button, Card, Carousel } from 'antd';
import logo from 'images/logo-mci.png';
import axios from 'axios';
import { RedoOutlined } from '@ant-design/icons';
import { useCookies } from 'react-cookie';
import notify from 'general/notify';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [cookie, setCookie] = useCookies(['token']);
    const [captcha, setCaptcha] = useState(null);

    // get captcha
    const getCaptcha = () => {
        setLoading(true);
        const instance = axios.create({
            responseType: 'arraybuffer',
        });
        instance
            .get('User/ReCaptcha')
            .then((res) => {
                // https://stackoverflow.com/a/52154751/9600858
                let blob = new Blob([res.data], {
                    type: res.headers['content-type'],
                });
                let image = URL.createObjectURL(blob);
                setCaptcha(image);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    useEffect(() => {
        getCaptcha();
    }, []);

    const onFinish = (values) => {
        setLoading(true);
        axios
            .post('User/Login', values)
            .then(({ data }) => {
                // check if token property exists
                if (data.token) {
                    setCookie('token', data.token, {
                        path: '/',
                        maxAge: 86400,
                    });
                }
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <div className="main">
            <Row>
                <Col xs={24} md={15}>
                    <Row justify="center" align="middle" className="login-cols">
                        <Col className="form">
                            <div className="login-logo">
                                <img src={logo} />
                            </div>
                            <h1>سامانه نوبت دهی همراه اول</h1>
                            <br />
                            <Spin delay={900} spinning={loading}>
                                <Form
                                    name="basic"
                                    labelCol={{ sm: 8, md: 7, lg: 6 }}
                                    autoComplete="off"
                                    validateTrigger="onSubmit"
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        label="نام کاربری"
                                        name="Username"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            size="large"
                                            className="ltr-left"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="رمز عبور"
                                        name="Password"
                                        rules={[{ required: true }]}
                                    >
                                        <Input.Password className="ltr" />
                                    </Form.Item>
                                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 16, offset: 8 }} md={{ span: 18, offset: 7 }} lg={{ span: 18, offset: 6 }}>
                                        <div className="captcha-wrapper">
                                            <img src={captcha} />
                                            <span
                                                className="refresh"
                                                onClick={getCaptcha}
                                            >
                                                <RedoOutlined className="act-icon" />
                                            </span>
                                        </div>
                                    </Col>
                                    <Form.Item
                                        label="کد کپچا"
                                        name="CaptchaCode"
                                        rules={[{ required: true }]}
                                        style={{ clear: 'both' }}
                                    >
                                        <Input
                                            size="large"
                                            className="ltr-left"
                                        />
                                    </Form.Item>

                                    <br />
                                    <center>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className="wider-button"
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
                <Col xs={0} md={9} className="login-cols">
                    <Carousel
                        dotPosition="left"
                        autoplay
                        speed={1000}
                        slidesToShow={1}
                        autoplaySpeed={4000}
                    >
                        <div className="bg1 login-image"></div>
                        <div className="bg2 login-image"></div>
                        <div className="bg3 login-image"></div>
                    </Carousel>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
