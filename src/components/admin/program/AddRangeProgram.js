import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    Checkbox,
    TimePicker as TimePicker1,
} from 'antd';
import notify from 'general/notify';
import axios from 'axios';
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { getNumeric, getDateFromObject } from 'general/Helper';
import moment from 'moment';

const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const { Option } = Select;
const format = 'HH:mm';

const AddRangeProgram = ({ match }) => {
    const [loading, setLoading] = useState(true);
    const [welfareId, setWelfareId] = useState(null);
    const { url } = match;
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        const type = url.split('/')[1]?.toUpperCase();
        axios.post('Welfare/Get', { type }).then(({ data }) => {
            // console.log(data);
            setWelfareId(data[0].id);
        });
    }, [url]);

    const onFinish = (values) => {
        values.welfareId = welfareId;
        values.dateFrom = getDateFromObject(values.dateFrom);
        values.dateTo = getDateFromObject(values.dateTo);

        values.timeFrom = values.time[0].format('HH:mm');
        values.timeTo = values.time[1].format('HH:mm');

        values.welfareClusterId = 0;
        values.clusterSectionId = 0;

        delete values.time;

        const today = new DateObject({ calendar: persian });

        console.log(values.dateFrom, ' -- ', today.format());
        if (values.dateFrom < today.format()) {
            notify.error('روزهای گذشته قابل انتخاب نیست');
            return;
        }

        if (values.dateTo < values.dateFrom) {
            notify.error('تاریخ پایان نمیتواند قبل از تاریخ شروع باشد');
            return;
        }
        
        // console.log(values);
        // return;

        delete values.time;


        setLoading(true);
        axios
            .post('DailyProgram/NewMultiple', values)
            .then(({ message }) => {
                notify.success(message);
                form.resetFields();
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <Form
            form={form}
            labelCol={{ xs: 7, md: 6, lg: 5, xlg: 5 }}
            onFinish={onFinish}
            scrollToFirstError={true}
        >
            <br />
            <Form.Item
                rules={[{ required: true }]}
                label="انتخاب تاریخ"
                style={{ marginBottom: -10, marginTop: -30 }}
            >
                <Form.Item
                    name="dateFrom"
                    // label="از تاریخ"
                    rules={[{ required: true }]}
                    style={{
                        display: 'inline-block',
                        width: 'calc(50% - 2px)',
                    }}
                >
                    <DatePicker
                        format="YYYY/MM/DD"
                        calendar={persian}
                        locale={persian_fa}
                        weekDays={weekDays}
                    />
                </Form.Item>
                <span
                    style={{
                        display: 'inline-block',
                        width: '2px',
                        lineHeight: '32px',
                        textAlign: 'center',
                    }}
                ></span>
                <Form.Item
                    name="dateTo"
                    // label="تا تاریخ"
                    rules={[{ required: true }]}
                    style={{
                        display: 'inline-block',
                        width: 'calc(50% - 2px)',
                    }}
                >
                    <DatePicker
                        format="YYYY/MM/DD"
                        calendar={persian}
                        locale={persian_fa}
                        weekDays={weekDays}
                    />
                </Form.Item>
            </Form.Item>

            <Form.Item
                name="weekDays"
                label="انتخاب روز"
                rules={[{ required: true }]}
            >
                <Select
                    mode="multiple"
                    placeholder="انتخاب روز"
                    // defaultValue={Object.keys(settingData.vipPersonel)}
                    // onChange={handleChange}
                    filterOption={(input, options) => {
                        return options.children.indexOf(input) >= 0;
                    }}
                    style={{ width: '100%' }}
                >
                    <Option value="saturday">شنبه</Option>;
                    <Option value="sunday">یک‌شنبه</Option>;
                    <Option value="monday">دوشنبه</Option>;
                    <Option value="tuesday">سه‌شنبه</Option>;
                    <Option value="wednesday">چهارشنبه</Option>;
                    <Option value="thursday">پنج‌شنبه</Option>;
                    <Option value="friday">جمعه</Option>;
                </Select>
            </Form.Item>

            <Form.Item name="gender" label="جنسیت" rules={[{ required: true }]}>
                <Select>
                    {welfareId !== 1 && <Option value={2}>هر دو</Option>}
                    <Option value={0}>خانم</Option>
                    <Option value={1}>آقا</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="time"
                label="زمان سانس"
                rules={[{ required: true }]}
                // extra=""
            >
                <TimePicker1.RangePicker
                    style={{ width: '100%' }}
                    defaultValue={moment('12:08', format)}
                    format={format}
                />
            </Form.Item>
            {welfareId !== 2 && (
                <Form.Item
                    name="capacity"
                    label="گنجایش"
                    rules={[{ required: true }]}
                    normalize={(val) => getNumeric(val)}
                >
                    <Input
                        suffix={<span className="form-postfix-text">نفر</span>}
                        maxLength={5}
                    />
                </Form.Item>
            )}

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
    );
};

export default AddRangeProgram;
