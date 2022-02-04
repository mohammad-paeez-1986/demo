import React, { useState, useEffect } from "react";
import {
    Row,
    Card,
    Col,
    Form,
    Input,
    Spin,
    Button,
    Select,
    Radio,
    InputNumber,
} from "antd";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
const { Option } = Select;

const ShowSettings = () => {
    return (
        <Col sm={24} xs={24} md={19} lg={13} xlg={12}>
            <Card title="تنظیمات">
                <Form
                    labelCol={{ xs: 7, md: 6, lg: 8, xlg: 5 }}
                    scrollToFirstError={true}
                >
                    <Form.Item
                        name="departmentId"
                        label="دپارتمان"
                        rules={[{ required: true }]}
                    >
                        <Col span={14}>
                            <Select>
                                <Option value={1}>مدیران واحد آی تی</Option>
                                <Option value={2}>امور رفاهی</Option>
                                <Option value={3}>مدیران واحد کافه</Option>
                            </Select>
                        </Col>
                    </Form.Item>
                    <Form.Item
                        name="reserve-time"
                        label="ساعت رزرو"
                        rules={[{ required: true }]}
                    >
                        <Input.Group size="large">
                            <Row gutter={100}>
                                <Col span={5}>
                                    {/* <Input defaultValue="" placeholder="از" /> */}
                                    <DatePicker
                                        disableDayPicker
                                        format="HH:mm"
                                        plugins={[<TimePicker hideSeconds />]}
                                        calendar={persian}
                                        locale={persian_fa}
                                        calendarPosition="bottom-right"
                                        style={{ width: 100 }}
                                    />
                                </Col>
                                <Col span={5}>
                                    {/* <Input defaultValue="" placeholder="تا" /> */}
                                    <DatePicker
                                        style={{ width: 100 }}
                                        disableDayPicker
                                        format="HH:mm"
                                        plugins={[<TimePicker hideSeconds />]}
                                        calendar={persian}
                                        locale={persian_fa}
                                        calendarPosition="bottom-right"
                                    />
                                </Col>
                            </Row>
                        </Input.Group>
                    </Form.Item>

                    <Form.Item
                        name="cancel"
                        label="ساعت کنسلی تا"
                        rules={[{ required: true }]}
                    >
                        <DatePicker
                            disableDayPicker
                            format="HH:mm"
                            plugins={[<TimePicker hideSeconds />]}
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                        />
                    </Form.Item>

                    <Form.Item
                        name="capacity"
                        label="گنجایش باشگاه"
                        rules={[{ required: true }]}
                    >
                        <InputNumber />{" "}
                        <span className="form-postfix-text">نفر</span>
                    </Form.Item>

                    <Form.Item
                        name="sans"
                        label="دفعات مجاز استفاده"
                        rules={[{ required: true }]}
                    >
                        <InputNumber />{" "}
                        <span className="form-postfix-text">بار</span>
                    </Form.Item>

                    <Form.Item
                        className="sm-font"
                        name="days"
                        label={
                            <span className="sm-font">
                                تعداد روزهای رزرو پیش از زمان
                            </span>
                        }
                        rules={[{ required: true }]}
                    >
                        <InputNumber />{" "}
                        <span className="form-postfix-text">روز</span>
                    </Form.Item>

                    <Form.Item
                        name="perios"
                        label="محدوده زمانی هر سانس"
                        rules={[{ required: true }]}
                    >
                        <InputNumber />{" "}
                        <span className="form-postfix-text">ساعت</span>
                    </Form.Item>

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
            </Card>
        </Col>
    );
};

export default ShowSettings;
