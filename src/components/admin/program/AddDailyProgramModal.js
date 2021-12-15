import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Checkbox, TimePicker } from "antd";
import notify from "general/notify";
import axios from "axios";
import { getNumeric } from "general/Helper";
import moment from "moment";

const { Option } = Select;
const format = "HH:mm";

const AddDailyProgramModal = ({
    date,
    onSetNewProgram,
    closeModal,
    welfareId,
}) => {
    const [welfareClusterList, setWelfareClusterList] = useState([]);
    // const [clusterName, setClusterName] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    // if (welfareId === 2) {
    //     setClusterName("اتاق");
    // } else if (welfareId === 4) {
    //     setClusterName("میز");
    // }

    // if (welfareId == 2 || welfareId == 4) {
    //     axios
    //         .post("/WelfareCluster/Get", {
    //             welfareId,
    //             welfareType: "gym",
    //         })
    //         .then(({ data }) => {
    //             setWelfareClusterList(data);
    //         })
    //         .catch((errorMessage) => {
    //             notify.error(errorMessage);
    //             setLoading(false);
    //         });
    // }
    // }, []);

    const onFinish = (values) => {
        values.shamsiDate = date;
        values.welfareId = welfareId;
        values.startTime = values.time[0].format("HH:mm");
        values.endTime = values.time[1].format("HH:mm");

        if (welfareId === 2) {
            values.capacity = 95;
        }

        delete values.time;

        if (welfareId != 2 || welfareId != 4) {
            delete values.clusterSectionId;
        }

        setLoading(true);
        axios
            .post("DailyProgram/New", values)
            .then(({ message }) => {
                notify.success(message);
                onSetNewProgram(date, true);
                closeModal();
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <div>
            <Form
                labelCol={{ xs: 7, md: 6, lg: 5, xlg: 5 }}
                onFinish={onFinish}
                scrollToFirstError={true}
                initialValues={{
                    isLocked: false,
                    isVip: false,
                }}
            >
                {/* {welfareId == 2 || welfareId == 4 ? (
                    <Form.Item
                        name="clusterSectionId"
                        label={`انتخاب ${clusterName}`}
                    >
                        <Select>
                            {welfareClusterList.map(
                                ({ welfareclusterId, clusterFa }) => (
                                    <Option value={welfareclusterId}>
                                        {clusterFa}
                                    </Option>
                                )
                            )}
                        </Select>
                    </Form.Item>
                ) : null} */}

                <Form.Item
                    name="genderAcceptance"
                    label="جنسیت"
                    rules={[{ required: true }]}
                >
                    <Select>
                        {welfareId !== 1 && <Option value={2}>هردو</Option>}
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
                    <TimePicker.RangePicker
                        style={{ width: "100%" }}
                        defaultValue={moment("12:08", format)}
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
                            suffix={
                                <span className="form-postfix-text">نفر</span>
                            }
                            maxLength={5}
                        />
                    </Form.Item>
                )}
                <Form.Item
                    name="isVip"
                    label="وی آی پی"
                    valuePropName="checked"
                >
                    <Checkbox></Checkbox>
                </Form.Item>

                <div className="ant-card-modal-footer">
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
        </div>
    );
};

export default AddDailyProgramModal;
