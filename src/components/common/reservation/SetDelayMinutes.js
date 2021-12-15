import React from "react";
import {
    Form,
    Input,
    Button,
    // TimePicker
} from "antd";
import { getNumeric } from "general/Helper";


const SetDelayMinutes = ({
    onReservationStatusChange,
    closeModal,
    reservationId,
}) => {
    const onFinish = ({ delayMinutes }) => {
        onReservationStatusChange(2, reservationId, delayMinutes);
    };

    return (
        <div>
            <Form
                labelCol={{ xs: 11, sm: 10, md: 8, lg: 8, xlg: 5 }}
                wrapperCol={{ xs: 12, md: 12, lg: 10, xlg: 5 }}
                onFinish={onFinish}
                scrollToFrstError={true}
                initialValues={{
                    delayMinutes: null,
                }}
            >
                <Form.Item
                    name="delayMinutes"
                    label="میزان تاخیر"
                    rules={[{ required: true }]}
                    normalize={(val) => getNumeric(val)}
                >
                    {/* <TimePicker
                        style={{ width: "100%" }}
                        defaultValue={moment("12:08", format)}
                        format={format}
                    /> */}
                    <Input
                        maxLength={2}
                        suffix={
                            <span className="form-postfix-text">دقیقه</span>
                        }
                        // className="ltr"
                    />
                </Form.Item>

                <div className="ant-card-modal-footer">
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
        </div>
    );
};

export default SetDelayMinutes;
