import { useState, useEffect } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import AddHoliday from "./AddHoliday";
import { Calendar, DateObject } from "react-multi-date-picker";
import {
    Card,
    Row,
    Col,
    Button,
    Space,
    Form,
    Modal,
    Table,
    Spin,
    Popconfirm,
} from "antd";
import notify from "general/notify";
import axios from "axios";
import { getDateFromObject } from "general/Helper";
import {
    CloseOutlined,
    CheckOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
// const weekDays = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه"]

const HolidaysCalendar = ({ match }) => {
    const [date, setDate] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [holidayList, setHolidayList] = useState([]);
    const [holidaysList, setHolidaysList] = useState([]);
    const [popConfirmVisible, setPopConfirmVisible] = useState(false)

    const getHolidayList = () => {
        axios
            .post("Calendar/Get", {
                shamsiDate: "0",
                description: "all",
            })
            .then(({ data }) => {
                setHolidayList(data);
                const holidaysList = data.map((item) => item.shamsiDate);
                setHolidaysList(holidaysList);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    useEffect(() => {
        getHolidayList();
    }, []);

    const onDayChange = (date, isObject = false) => {
        let selectedDate;
        if (!isObject) {
            selectedDate = getDateFromObject(date);
            setDate(selectedDate);
        } else {
            selectedDate = date;
        }
    };

    const closeModal = () => {
        getHolidayList();
        setIsModalVisible(false);
    };

    const onDelete = (shamsiDate) => {
        setLoading(true);
        axios
            .post("Calendar/Remove", {
                shamsiDate,
            })
            .then(() => {
                let newHolidayList;

                newHolidayList = holidayList.filter(
                    (item) => item.shamsiDate !== shamsiDate
                );

                setHolidayList(newHolidayList);
                const holidaysList = newHolidayList.map((item) => item.shamsiDate);
                setHolidaysList(holidaysList);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    const columns = [
        {
            title: "تاریخ",
            dataIndex: "shamsiDate",
            key: "id",
        },
        {
            title: "شرح",
            key: "description",
            dataIndex: "description",
        },
        {
            title: "حذف",
            className: "act-icon delete",
            onCell: (record) => {
                // setPopConfirmVisible
            },
            render: ({ shamsiDate }) => (
                <Popconfirm
                    // visible={popConfirmVisible}
                    title="آیا مطمئن هستید؟"
                    onConfirm={() => onDelete(shamsiDate)}
                >
                    <DeleteOutlined />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Row gutter={16}>
            <Col sm={24} xs={24} md={19} lg={12} xlg={12}>
                <Card title="ثبت تعطیلی">
                    <div id="large-calendar">
                        <Calendar
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            weekDays={weekDays}
                            onChange={onDayChange}
                            value={date}
                            format={"YYYY/MM/DD"}
                            mapDays={({ date }) => {
                                    let props = {};

                                    if (
                                        holidaysList.includes(
                                            getDateFromObject(date)
                                        )
                                    )
                                        return {
                                            disabled: true,
                                            style: { color: "#f30" },
                                            onClick: () =>
                                                notify.error(
                                                    "این روز تعطیل می  باشد"
                                                ),
                                        };
                                }}
                        />
                    </div>
                    <br />

                    <div className="ant-card-footer">
                        <Space>
                            <Button
                                onClick={() => setIsModalVisible(true)}
                                type="primary"
                                htmlType="submit"
                                className="wide-button"
                            >
                                افزودن تعطیلی
                            </Button>
                        </Space>
                    </div>
                </Card>

                <Modal
                    title="افزودن تعطیلی"
                    visible={isModalVisible}
                    footer={null}
                    destroyOnClose={true}
                    onCancel={closeModal}
                >
                    <AddHoliday
                        date={date}
                        onSetNewProgram={onDayChange}
                        closeModal={closeModal}
                    />
                </Modal>
            </Col>

            <Col sm={24} xs={24} md={19} lg={12} xlg={12}>
                <Card title="لیست تعطیلی ها">
                    <Table
                        bordered
                        columns={columns}
                        pagination={{
                            hideOnSinglePage: true,
                        }}
                        dataSource={holidayList}
                        loading={loading}
                        scroll={{ x: true }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default HolidaysCalendar;
