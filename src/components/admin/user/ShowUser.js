import React, { useState, useEffect } from "react";
import { Card, Table, Button, Switch, Divider } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { FormOutlined, FilterOutlined } from "@ant-design/icons";
import FilterUser from "./FilterUser";
import notify from "general/notify";
import { usePaginate } from "hooks/usePaginate";

const ShowUser = ({ history }) => {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({});
    const [filterVisibility, setFilterVisibility] = useState("hide");
    const [filterActiveClass, setFilterActiveClass] = useState(null);

    const {
        pageIndex,
        setPageIndex,
        pageSize,
        setPageSize,
        total,
        setTotal,
        paginationData,
    } = usePaginate();

    useEffect(() => {
        setLoading(true);
        axios.post("User/List", { pageIndex, pageSize, ...filter }).then((res) => {
            const { data } = res;
            setTotal(res.totalrecords);
            setUserList(data);
            setLoading(false);
        });
    }, [filter, pageIndex, pageSize]);

    // change user activity
    const onActivityChange = (row, checked, e) => {
        // setLoading(true);
        let userStatus, uri;
        if (checked) {
            userStatus = "فعال";
            uri = "Activate";
        } else {
            userStatus = "غیرفعال";
            uri = "DeActivate";
        }

        axios
            .post(`User/${uri}`, { userId: row.userId })
            .then((res) => {
                // modify row which status is changed in userList
                const newUserList = userList.map((item) =>
                    item.username === row.username
                        ? { ...row, userStatus }
                        : item
                );

                setUserList(newUserList);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    // change filter visibility
    const onFilterVisibilityChange = () => {
        if (filterVisibility === "show") {
            setFilterVisibility("hide");
            setFilterActiveClass(null);
        } else {
            setFilterVisibility("show");
            setFilterActiveClass("active");
        }
    };

    const getRoleText = (roleId, rolenamefa, welfareName) => {
        let text = rolenamefa;

        if (roleId === 2) {
            text += ` (${welfareName})`;
        }

        return text;
    };

    // columns of table, and values
    const columns = [
        {
            title: "نام",
            dataIndex: "namefa",
            key: "namefa",
        },
        {
            title: "نقش",
            key: "rolenamefa",
            render: ({ roleId, rolenamefa, welfareName }) =>
                getRoleText(roleId, rolenamefa, welfareName),
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
        // {
        //     title: "ایمیل",
        //     dataIndex: "email",
        //     key: "email",
        // },
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
            dataIndex: "personelcode",
            key: "personelcode",
        },
        {
            title: "نام کاربری",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "فعال",
            className: "act-icon edit",
            render: (record) => {
                const active = record.userStatus === "فعال" ? true : false;
                return (
                    <Switch
                        size="small"
                        checked={active}
                        onChange={(checked, e) =>
                            onActivityChange(record, checked, e)
                        }
                    />
                );
            },
        },
        {
            title: "ویرایش",
            className: "act-icon edit",
            onCell: (record) => {
                return {
                    onClick: () => {
                        history.push({
                            pathname: "/user/update",
                            state: { userId: record.userId },
                        });
                    },
                };
            },
            render: (record) => <FormOutlined />,
        },
    ];

    return (
        <div>
            <Card
                title="لیست کاربران"
                extra={[
                    <Link to="/user/newuserpersonel">
                        <Button
                            type="secondary"
                            ghost
                            className="ghost"
                            size="small"
                        >
                            افزودن کاربر
                        </Button>
                    </Link>,
                    <Divider type="vertical" orientation="center" />,
                    <div
                        onClick={onFilterVisibilityChange}
                        className={`filter-icon ${filterActiveClass}`}
                    >
                        <FilterOutlined />
                    </div>,
                ]}
            >
                <FilterUser
                    filter={filter}
                    setFilter={setFilter}
                    filterVisibility={filterVisibility}
                />
                <Table
                    bordered
                    columns={columns}
                    pagination={paginationData}
                    dataSource={userList}
                    scroll={{ x: true }}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default ShowUser;
