import React, { useState, useEffect } from "react";
import { Col, Card, Button, Form, Select, Spin, Input } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const Add = () => {
    const [loading, setLoading] = useState(true);
    const [departmentList, setDepartmentList] = useState([]);
    const [workGroupList, setWorkGroupList] = useState([]);

    const onFinish = (values) => {};

    useEffect(() => {
        axios
            .all([axios.post("Department/Get"), axios.post("Workgroup/Get")])
            .then((res) => {
                setDepartmentList(res[0].data);
                setWorkGroupList(res[1].data);
                setLoading(false);
            })
            .catch((err) => console.log(err));
    }, []);
    return (
        <div>
            <Col sm={24} xs={20} md={18} lg={12}>
                <Card title="ثبت پرسنل جدید">
                    <Spin delay={900} spinning={loading}>
                        <Form onFinish={onFinish} labelCol={{ span: 6 }}>
                            <Form.Item
                                name="depatrment"
                                label="دپارتمان"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    placeholder="دپارتمان را انتخاب کنید"
                                    allowClear
                                >
                                    {departmentList.map(({ id, nameFa }) => {
                                        return (
                                            <Option value={id}>{nameFa}</Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="workgroup"
                                label="کارگروه"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    placeholder="کارگروه را انتخاب کنید"
                                    allowClear
                                >
                                    {workGroupList.map(({ id, nameFa }) => {
                                        return (
                                            <Option value={id}>{nameFa}</Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="nameFa"
                                label={
                                    <span className="sm-font">
                                        نام و نام خانوادگی
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="personelCode"
                                label="کد کارمندی"
                                parser={(value) => alert("ss")}
                                normalize={(val, a, s) => {
                                    return val
                                    if (isNaN(val)) {
                                        return s.personelCode
                                    }
                                }}
                                rules={[
                                    {
                                        required: true,
                                        type:"number"
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Spin>
                </Card>
            </Col>
        </div>
    );
};

export default Add;
