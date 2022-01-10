import React, { useState, useEffect } from "react";
import { Row, Card, Col, Form, Input, Spin, Button, Table, Select } from "antd";
import notify from "general/notify";
import axios from "axios";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { getDateFromObject } from "general/Helper";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { usePaginate } from "hooks/usePaginate";

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const { Option } = Select;

const ShowReservationReportForOperator = () => {
    const [filterPartloading, setFilterPartloading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [welfareList, setWelfareList] = useState([]);
    const [workGroupList, setWorkGroupList] = useState([]);
    const [reservationList, setReservationList] = useState([]);
    const [isFirstRequestSent, setIsFirstRequestSent] = useState(false);
    const [formOutput, setFormOutput] = useState({});
    const [form] = Form.useForm();

    useEffect(() => {
        axios
            .all([
                axios.post("Welfare/Get", { type: null }),
                axios.post("Workgroup/Get"),
            ])
            .then((res) => {
                setWelfareList(res[0].data);
                setWorkGroupList(res[1].data);
                setFilterPartloading(false);
            });
    }, []);

    const {
        pageIndex,
        setPageIndex,
        pageSize,
        setPageSize,
        total,
        setTotal,
        paginationData,
    } = usePaginate(form.submit);

    const columns = [
        {
            title: "نام",
            dataIndex: "namefa",
            key: "namefa",
        },

        {
            title: "کد کارمندی",
            dataIndex: "personelCode",
            key: "personelCode",
        },
        {
            title: "بخش",
            dataIndex: "welfarenamefa",
            key: "welfarenamefa",
        },
        {
            title: "تاریخ",
            dataIndex: "dailyProgramShamsiDate",
            key: "dailyProgramShamsiDate",
        },
        {
            title: "زمان سانس",
            key: "startTime",
            render: ({ startTime, endTime }) => `${endTime} - ${startTime}`,
        },
        {
            title: "وضعیت",
            dataIndex: "statusReserve",
            key: "statusReserve",
        },

        {
            title: "وی آی پی",
            key: "isVip",
            className: "edit",
            render: (record) =>
                record.isVip ? (
                    <CheckOutlined className="green" />
                ) : (
                    <CloseOutlined className="red" />
                ),
        },
    ];

    const onFinish = (values) => {
        values.dateFrom = getDateFromObject(values.dateFrom);

        if (values.dateTo) {
            values.dateTo = getDateFromObject(values.dateTo);
        }

        setFormOutput(values);

        setTableLoading(true);
        axios
            .post("Report/Reservation", values)
            .then(({ data }) => {
                setReservationList(data);
                if (isFirstRequestSent === false) {
                    setIsFirstRequestSent(true);
                }
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setTableLoading(false));
    };

    const downloadReport = () => {
        // axios
        //     .post("Report/ReservationAggregate", formOutput)
        //     .then(({ data }) => {})
        //     .catch((errorMessage) => notify.error(errorMessage));

        axios
            .post("Report/ReservationExcel", formOutput, {
                headers: {
                    "Content-Disposition": "attachment; filename=template.xlsx",
                    "Content-Type":
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                },
                responseType: "arraybuffer",
            })
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "template.xlsx");
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => console.log(error));
    };

    return (
        <div>
            <Card>
                <Spin delay={900} spinning={filterPartloading}>
                    <Form
                        labelCol={{ xs: 3, md: 5, lg: 5 }}
                        onFinish={onFinish}
                        scrollToFrstError={true}
                        form={form}
                        initialValues={{
                            welfareId: 0,
                            presenceStatus: -1,
                            workgroupId: 0,
                        }}
                    >
                        <Row gutter={18}>
                            <Col lg={7} md={12} xs={24}>
                                <Form.Item
                                    name="dateFrom"
                                    label="از تاریخ"
                                    rules={[{ required: true }]}
                                >
                                    <DatePicker
                                        format="YYYY/MM/DD"
                                        calendar={persian}
                                        locale={persian_fa}
                                        weekDays={weekDays}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="dateTo"
                                    label="تا تاریخ"
                                    // rules={[{ required: true }]}
                                >
                                    <DatePicker
                                        format="YYYY/MM/DD"
                                        calendar={persian}
                                        locale={persian_fa}
                                        weekDays={weekDays}
                                    />
                                </Form.Item>
                            </Col>

                            <Col lg={8} md={12} xs={24}>
                                <Form.Item
                                    name="presenceStatus"
                                    label="وضعیت"
                                    // rules={[{ required: true }]}
                                >
                                    <Select>
                                        <Option value={-1}>همه</Option>
                                        <Option value={0}>
                                            در مرحله تائید رزرو
                                        </Option>
                                        <Option value={1}>تائید رزرو</Option>
                                        <Option value={2}>حضور</Option>
                                        <Option value={3}>غیبت</Option>
                                        <Option value={7} disabled>
                                            لغو توسط کاربر
                                        </Option>
                                        <Option value={8}>رد درخواست</Option>
                                        <Option value={9} disabled>
                                            لغو توسط سیستم
                                        </Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="workgroupId" label="کارگروه">
                                    <Select>
                                        <Option value={0}>همه</Option>
                                        {workGroupList.map(({ id, nameFa }) => (
                                            <Option value={id}>{nameFa}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={{ span: 8, offset: 1 }} md={12} xs={24}>
                                <Form.Item
                                    wrapperCol={{
                                        lg: { span: 19, offset: 5 },
                                        md: { span: 19, offset: 5 },
                                        sm: { span: 21, offset: 3 },
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="wide-button float-left"
                                        block
                                    >
                                        مشاهده
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Card>
            {isFirstRequestSent && (
                <Card
                    title="مشاهده گزارش"
                    extra={[
                        <Button size="small" onClick={downloadReport}>
                            خروجی اکسل
                        </Button>,
                    ]}
                >
                    <Table
                        bordered
                        columns={columns}
                        pagination={paginationData}
                        loading={tableLoading}
                        dataSource={reservationList}
                        scroll={{ x: true }}
                    />
                </Card>
            )}
        </div>
    );
};

export default ShowReservationReportForOperator;
