import { useState, useEffect } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar } from "react-multi-date-picker";
import {
    Card,
    Col,
    Table,
    Spin,
} from "antd";
import notify from "general/notify";
import axios from "axios";
import { getDateFromObject } from "general/Helper";
import {
    CloseOutlined,
    CheckOutlined,
} from "@ant-design/icons";

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const ShowCalendar = ({ match }) => {
    const [date, setDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDayProgramList, setSelectedDayProgramList] = useState([]);
    const [welfareId, setWelfareId] = useState(null);
    const { url } = match;

    useEffect(() => {
        setDate(null)
        const type = url.split("/")[1]?.toUpperCase();
        axios.post("Welfare/Get", { type }).then(({ data }) => {
            setWelfareId(data[0].id);
        });
    }, [url]);

    const onDayChange = (date, isObject = false) => {
        let selectedDate;
        if (!isObject) {
            selectedDate = getDateFromObject(date);
            setDate(selectedDate);
        } else {
            selectedDate = date;
        }

        setLoading(true);
        axios
            .post("DailyProgram/Get", {
                dateFrom: selectedDate,
                dateTo: selectedDate,
                welfare: welfareId,
            })
            .then(({ data }) => {
                setSelectedDayProgramList(data);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    const columns = [
        {
            title: "گنجایش",
            dataIndex: "capacity",
            key: "capacity",
        },
        {
            title: "وی آی پی",
            key: "isVip",
            render: (record) =>
                record.isVip ? (
                    <CheckOutlined className="green" />
                ) : (
                    <CloseOutlined className="red" />
                ),
        },
        {
            title: "زمان سانس",
            key: "id",
            render: ({ startTime, endTime }) => `از ${startTime} تا ${endTime}`,
        },
        {
            title: "جنیست",
            dataIndex: "genderAcceptance",
            key: "genderAcceptance",
        },
    ];
    
    return (
        <Col sm={24} xs={24} md={19} lg={15} xlg={12}>
            <Spin delay={900} spinning={loading}>
                <Card title="مشاهده تقویم">
                    <div id="large-calendar">
                        <Calendar
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            weekDays={weekDays}
                            onChange={onDayChange}
                            value={date} 
                        />
                    </div>
                    <br />
                    <Table
                        bordered
                        columns={columns}
                        pagination={{
                            hideOnSinglePage: true,
                        }}
                        dataSource={selectedDayProgramList}
                        loading={loading}
                        scroll={{ x: true }}
                    />
                </Card>
            </Spin>
        </Col>
    );
};

export default ShowCalendar;
