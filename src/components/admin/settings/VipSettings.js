import React, { useState, useEffect } from "react";
import {
    Form,
    Spin,
    Button,
    Select,
    Radio,
} from "antd";
import notify from "general/notify";
import axios from "axios";

const { Option } = Select;

const VipSettings = ({ welfareId }) => {
    // console.log(welfareId)
    const [settingData, setSettingData] = useState({});
    const [userList, setUserList] = useState([]);
    const [workGroupList, setWorkGroupList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        axios
            .all([
                axios.post("User/List", {}),
                axios.post("Workgroup/Get"),
                axios.post("WelfareSetting/GetLast", { welfareId }),
            ])
            .then((res) => {
                setUserList(res[0].data);
                setWorkGroupList(res[1].data);
                setSettingData(res[2].data);

                // initialize form
                const { vipPersonel, vipWorkgroup } = res[2].data;

                form.setFieldsValue({
                    vipPersonelCode: Object.keys(vipPersonel),
                    vipWorkgroupId: Object.keys(vipWorkgroup).map((item) =>
                        parseInt(item)
                    ),
                });

                // console.log(Object.keys(res[2].data.vipWorkgroup));
                setLoading(false);
            })
            .catch((err) => console.log(err));
    }, [welfareId]);

    const onFinish = (values) => {
        // add setting id
        values.welfareSettingId = settingData.id;

        setLoading(true);
        axios
            .post("WelfareSetting/AssignVip", values)
            .then(({ message }) => {
                notify.success(message);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <Spin delay={900} spinning={loading}>
            <Form
                labelCol={{ md: 4 }}
                // wrapperCol={{ xs: 12, sm:19,md: 14, lg: 19, xlg: 17 }}
                onFinish={onFinish}
                scrollToFirstError={true}
                form={form}
            >
                <Form.Item
                    name="vipWorkgroupId"
                    label="کارگروه"
                    rules={[{ required: true }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="انتخاب کارگروه"
                        // defaultValue={Object.keys(settingData.vipPersonel)}
                        // onChange={handleChange}
                        filterOption={(input, options) => {
                            return options.children.indexOf(input) >= 0;
                        }}
                        style={{ width: "100%" }}
                    >
                        {workGroupList.map(({ id, nameFa }) => {
                            return <Option value={id}>{nameFa}</Option>;
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="vipPersonelCode"
                    label="کاربر"
                    rules={[{ required: true }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="انتخاب کاربر"
                        style={{ width: "100%" }}
                        filterOption={(input, options) => {
                            return options.children.indexOf(input) >= 0;
                        }}
                    >
                        {userList.map(({ personelcode, namefa }) => {
                            return (
                                <Option value={personelcode}>{namefa}</Option>
                            );
                        })}
                    </Select>
                </Form.Item>

                <div className="ant-card-tab-footer">
                    <Form.Item wrapperCol={{ span: 24 }}>
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
    );
};

export default VipSettings;
