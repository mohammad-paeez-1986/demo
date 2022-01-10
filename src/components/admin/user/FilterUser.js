import React, { useState } from "react";
import { Button, Form, Select, Input, Space } from "antd";
import axios from "axios";
const { Option } = Select;

const FilterUser = ({ setFilter, filterVisibility }) => {
    const [filterTypeName, setFilterTypeName] = useState("");
    const [rolesList, setRolesList] = useState([]);
    const [filterValueInput, setFilterValueInput] = useState(
        <Input disabled />
    );
    const [form] = Form.useForm();

    // get filter value input, if type is role
    const getRolesInput = async () => {
        const rolesList = await getRolesList();
        return (
            <Select>
                <Option value="">همه</Option>
                {rolesList.map(({ roleNameEn, roleNameFa }) => (
                    <Option value={roleNameEn}>{roleNameFa}</Option>
                ))}
            </Select>
        );
    };

    // get roles list if not gotten before
    const getRolesList = async () => {
        let result;
        if (!rolesList.length) {
            await axios.post("User/GetRoles").then((res) => {
                const { data } = res;
                setRolesList(data);
                result = data;
            });
        }

        return result ? result : rolesList;
    };

    // get filter value input
    const onFilterTypeChange = async (val) => {
        let filterValueInput, filterTypeName;

        switch (val) {
            case "userRole":
                filterValueInput = await getRolesInput();
                break;
            case "username":
                filterValueInput = (
                    <Input placeholder="نام کاربری را وارد کنید" />
                );
                break;
            case "personelcode":
                filterValueInput = (
                    <Input placeholder="کد کارمندی را وارد کنید" />
                );
                break;
            case "nameFa":
                filterValueInput = <Input placeholder="نام را وارد کنید" />;
                break;
            case "nationalCode":
                filterValueInput = <Input placeholder="کد ملی را وارد کنید" />;
                break;
        }

        setFilterTypeName(val);
        setFilterValueInput(filterValueInput);
    };

    // make object of filter
    const makeFilterObject = (values) => {
        let obj = {};
        obj[values.type] = values[Object.keys(values)[1]];
        setFilter(obj);
    };

    const removeFilter = () => {
        setFilter({});
        form.resetFields();
    };

    return (
        <div className={`filter ${filterVisibility}`}>
            <Form
                onFinish={makeFilterObject}
                wrapperCol={{ lg: 9, sm: 16 }}
                labelCol={{ lg: 4, md: 7, sm: 7 }}
                className="mini-form"
                form={form}
            >
                <Form.Item
                    name="type"
                    rules={[{ required: true }]}
                    label="انتخاب نوع فیلتر"
                >
                    <Select onChange={(val) => onFilterTypeChange(val)}>
                        <Option value="userRole">نقش</Option>
                        <Option value="username">نام کاربری</Option>
                        <Option value="personelcode">کد کارمندی</Option>
                        <Option value="nameFa">نام</Option>
                        <Option value="nationalCode">کد ملی</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name={filterTypeName}
                    label="تعیین مقدار فیلتر"
                    rules={[{ required: true }]}
                    style={{marginTop:9}}
                >
                    {filterValueInput}
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        lg: { offset: 4 },
                        md: { offset: 7 },
                        sm: { offset: 7 },
                    }}
                >
                <Space style={{marginTop:5}}>
                    <Button type="primary" htmlType="submit">
                        اعمال فیلتر
                    </Button>
                    <Button
                        type="default"
                        onClick={removeFilter}
                    >
                        حذف فیلتر
                    </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FilterUser;
