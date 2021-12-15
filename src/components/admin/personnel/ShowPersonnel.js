import React, { useState, useEffect } from "react";
import { Card, Table, Tag, Space, Button } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";

const Add = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .post("Personel/Get", {
                personelCode: null,
            })
            .then((res) => {
                const { data } = res;
                setList(data);
                setLoading(false);
            });
    }, []);
    const columns = [
        {
            title: "نام",
            dataIndex: "nameFa",
            key: "nameFa",
        },
        {
            title: "دپارتمان",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "کارگروه",
            dataIndex: "workgroup",
            key: "workgroup",
        },
        {
            title: "ایمیل",
            dataIndex: "email",
            key: "email",
        },
        // {
        //     title: "جنسیت",
        //     dataIndex: "gender",
        //     key: "gender",
        // },
        {
            title: "موبایل",
            dataIndex: "mobile",
            key: "mobile",
        },
        {
            title: "شماره داخلی",
            dataIndex: "internalNumber",
            key: "internalNumber",
        },
        {
            title: "کد کارمندی",
            dataIndex: "personelCode",
            key: "personelCode",
        },
        {
            title: "کد ملی",
            dataIndex: "nationalCode",
            key: "nationalCode",
        },
        {
            title: "ویرایش",
            className: "act-icon edit",
            render: (record) => <EditOutlined/>,
        },
    ];

    return (
        <div>
            <Card
                title="لیست پرسنل"
                extra={
                    <Link to="/personel/new">
                        <Button type="secondary" ghost className="ghost ">
                            افزودن پرسنل
                        </Button>
                    </Link>
                }
            >
                <Table
                    bordered
                    columns={columns}
                    dataSource={list}
                    loading={loading}
                    scroll={{x:true}}
                />
            </Card>
        </div>
    );
};

export default Add;
