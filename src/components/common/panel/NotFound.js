import { Result } from "antd";

const NotFound = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="چنین آدرسی یافت نشد."
        />
    );
};

export default NotFound;
