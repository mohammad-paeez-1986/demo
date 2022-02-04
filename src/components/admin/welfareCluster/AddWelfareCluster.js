import React, { useState, useEffect } from "react";
import { Card, Spin, Col, Form, Input, Button, Select, Radio } from "antd";
import axios from "axios";
import notify from "general/notify";
import { useGet } from "hooks/useGet";
const { Option } = Select;

const AddWelfareCluster = () => {
    const {
        dataList: welfareList,
        loading,
        setLoading,
    } = useGet("Welfare/Get");
    const [form] = Form.useForm();

    const onFinish = (s) => {
        // setLoading(false);
    };

    return (
        <Col sm={24} xs={24} md={19} lg={15} xlg={12}>
            <Card title="ثبت ">
                <Spin delay={900} spinning={loading}>
                    <Form
                        labelCol={{ xs: 7, md: 6, lg: 4, xlg: 5 }}
                        onFinish={onFinish}
                        scrollToFirstError={true}
                        form={form}
                    >
                        <Form.Item
                            name="welfareId"
                            label="بخش"
                            rules={[{ required: true }]}
                        >
                            <Select>
                                {welfareList.map(({ id, name }) => (
                                    <Option value={id}>{name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </Col>
    );
};

export default AddWelfareCluster;
