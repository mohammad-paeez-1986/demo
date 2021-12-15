import React, { useState, useEffect } from "react";
import { Card, Col, Form, Input, Spin, Button, Select } from "antd";
import axios from "axios";
import notify from "general/notify";
import { getUriAndMessageType } from "general/Helper";
// import { useGet } from "hooks/useGet";

const { Option } = Select;

const AddMessage = ({ match }) => {
    const [loading, setLoading] = useState(true);
    const [welfareList, setWelfareList] = useState([]);
    const [form] = Form.useForm();
    const { path } = match;
    const [messageType, setMessageType] = useState(null);
    const [uri, setUri] = useState(null);

    // const {
    //     dataList: welfareList,
    //     loading,
    //     setLoading,
    // } = useGet("Welfare/Get", {type:0});

    useEffect(() => {
        axios.post("Welfare/Get", { type: null }).then(({ data }) => {
            setWelfareList(data);
            setLoading(false);
        });

        // get path
        const { uri, messageType } = getUriAndMessageType(path.split("/")[1]);
        setMessageType(messageType);
        setUri(uri);
    }, [path]);

    const onFinish = (values) => {
        // alert(uri);

        const isPublic = values.welfareId === 0 ? true : false;
        values.isPublic = isPublic;

        axios
            .post(`/${uri}/New`, values)
            .then(({ message }) => {
                notify.success(message);

                // reset fields
                form.resetFields();
            })
            .catch((errorMessage) => notify.error(errorMessage));
    };

    return (
        <Col sm={24} xs={24} md={19} lg={15} xlg={12}>
            <Card title={`ثبت ${messageType} جدید`}>
                <Spin delay={900} spinning={loading}>
                    <Form
                        labelCol={{ xs: 7, md: 6, lg: 4, xlg: 5 }}
                        onFinish={onFinish}
                        scrollToFrstError={true}
                        form={form}
                    >
                        <Form.Item
                            name="welfareId"
                            label="بخش"
                            rules={[{ required: true }]}
                        >
                            <Select>
                                <Option value={0}>عمومی</Option>
                                {welfareList.map(({ id, name }) => (
                                    <Option value={id}>{name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="title"
                            label="عنوان"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="body"
                            label="متن"
                            rules={[{ required: true }]}
                        >
                            <Input.TextArea rows={7} />
                        </Form.Item>

                        {/* <Form.Item
                            name="isPublic"
                            label="عمومی"
                            valuePropName="checked"
                        >
                            <Checkbox></Checkbox>
                        </Form.Item> */}

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

export default AddMessage;
