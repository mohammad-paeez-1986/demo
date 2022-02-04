import React, { useState } from "react";
import { Spin, Button } from "antd";
import axios from "axios";
import notify from "general/notify";

const ResetPassword = ({ userId }) => {
    const [loading, setLoading] = useState(false);
    const onResetPassword = () => {
        setLoading(true);
        axios
            .post("User/ResetPassword", { userId })
            .then(({ message }) => {
                notify.success(message);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    return (
        <Spin delay={900} spinning={loading}>
            <div className="desc">
                <br />
                پس از بازنشانی، رمز عبور کاربر به کد ملی تغییر خواهد کرد.
            </div>
            <div className="ant-card-footer">
                <Button
                    onClick={onResetPassword}
                    type="primary"
                    htmlType="submit"
                    className="wide-button"
                >
                    بازنشانی رمزعبور
                </Button>
            </div>
        </Spin>
    );
};

export default ResetPassword;
