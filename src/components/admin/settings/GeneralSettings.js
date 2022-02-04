import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Spin,
    Button,
    TimePicker,
} from "antd";
import notify from "general/notify";
import axios from "axios";
import { getNumeric } from "general/Helper";
import moment from "moment";

const format = "HH:mm";

const GeneralSettings = ({welfareId}) => {
    const [, setSettingData] = useState({});
    // const [loading, setLoading] = useState(true)
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();


    useEffect(() => {
        axios
            .post("WelfareSetting/GetLast", { welfareId })
            .then(({ data }) => {
                setSettingData(data);
                const {
                    alloweTimes,
                    maximumCapacity,
                    programGapTimeMinutes,
                    programTimeMinutes,
                    reserveDaysBefore,
                    reserveTimeFrom,
                    reserveTimeTo,
                    revokeTimeTo,
                } = data;
                form.setFieldsValue({
                    reserveTime: [
                        moment(reserveTimeFrom, "HH:mm"),
                        moment(reserveTimeTo, "HH:mm"),
                    ],
                    revokeTimeTo: moment(revokeTimeTo, "HH:mm"),
                    alloweTimes,
                    maximumCapacity,
                    programGapTimeMinutes,
                    programTimeMinutes,
                    reserveDaysBefore,
                });
            })
            // .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    }, [welfareId]);

    const onFinish = (values) => {
        values.revokeTimeTo = values.revokeTimeTo.format("HH:mm");
        values.reserveTimeFrom = values.reserveTime[0].format("HH:mm");
        values.reserveTimeTo = values.reserveTime[1].format("HH:mm");
        values.welfareId = welfareId;
        values.vipWorkgroupId = []
        values.vipPersonelCode = []
        // delete values.reserveTime;

        axios
            .post("WelfareSetting/New", values)
            .then(({message}) => {
                notify.success(message);

            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <div>
        <br />
        <Spin delay={900} spinning={loading}>
            <Form
                labelCol={{ xs: 11, sm: 10, md: 8, lg: 8, xlg: 5 }}
                wrapperCol={{ xs: 12, md: 12, lg: 10, xlg: 5 }}
                onFinish={onFinish}
                scrollToFirstError={true}
                form={form}
                // initialValues={{

                //     maximumCapacity: 10,
                // }}
            >
                <Form.Item
                    name="reserveTime"
                    label="ساعت رزرو"
                    rules={[{ required: true }]}
                >
                    <TimePicker.RangePicker
                    style={{width:"100%"}}
                        defaultValue={moment("12:08", format)}
                        format={format}
                    />
                </Form.Item>

                <Form.Item
                    name="revokeTimeTo"
                    label="ساعت کنسلی تا"
                    rules={[{ required: true }]}
                >
                    <TimePicker
                        style={{ width: "100%" }}
                        defaultValue={moment("12:08", format)}
                        format={format}
                    />
                </Form.Item>

                <Form.Item
                    name="maximumCapacity"
                    label="گنجایش"
                    rules={[{ required: true }]}
                    normalize={(val) => getNumeric(val)}
                >
                    <Input
                        suffix={<span className="form-postfix-text">نفر</span>}
                        maxLength={5}
                    />
                </Form.Item>
                <Form.Item
                    name="alloweTimes"
                    label="دفعات مجاز استفاده"
                    rules={[{ required: true }]}
                    normalize={(val) => getNumeric(val)}
                >
                    <Input
                        suffix={<span className="form-postfix-text">بار</span>}
                        maxLength={5}
                    />
                </Form.Item>

                <Form.Item
                    className="sm-font"
                    name="reserveDaysBefore"
                    label={
                        <span className="sm-font">
                            تعداد روزهای رزرو پیش از زمان
                        </span>
                    }
                    rules={[{ required: true }]}
                    normalize={(val) => getNumeric(val)}
                >
                    <Input
                        suffix={<span className="form-postfix-text">روز</span>}
                        maxLength={5}
                    />
                </Form.Item>

                <Form.Item
                    name="programTimeMinutes"
                    label="محدوده زمانی هر سانس"
                    rules={[{ required: true }]}
                    normalize={(val) => getNumeric(val)}
                >
                    <Input
                        suffix={
                            <span className="form-postfix-text">دقیقه</span>
                        }
                        maxLength={5}
                    />
                </Form.Item>

                <Form.Item
                    name="programGapTimeMinutes"
                    label="فاصله زمانی بین هر سانس"
                    rules={[{ required: true }]}
                    normalize={(val) => getNumeric(val)}
                >
                    <Input
                        suffix={
                            <span className="form-postfix-text">دقیقه</span>
                        }
                        maxLength={5}
                    />
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
        </div>
    );
};

export default GeneralSettings;
