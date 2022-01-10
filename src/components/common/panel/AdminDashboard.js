import { Card, Row, Col, Result, Button } from "antd";
// import Chart1 from "./Chart1";
// import Chart2 from "./Chart2";

const AdminDashboard = () => {
    return (
        <div className="site-card-wrapper">
            <Result
                status="success"
                icon={<></>}
                title={
                    <div className="dashboard-admin">
                        <h2>به پنل ادمین خوش آمدید</h2>
                    </div>
                }
            />
            ,
            {/* <Row gutter={30}>
                <Col md={12} sm={24}>
                    <Card title="آمار کلی" bordered={false}>
                        <Chart1 />
                    </Card>
                </Col>
                <Col md={12} sm={24}>
                    <Card title="نمودار دایره" bordered={false}>
                        <Chart2 />
                    </Card>
                </Col>
            </Row> */}
        </div>
    );
};

export default AdminDashboard;
