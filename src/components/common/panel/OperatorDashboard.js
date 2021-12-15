import { Card, Row, Col } from "antd";
import Chart1 from "./Chart1";
import Chart3 from "./Chart3";

const OperatorDashboard = () => {
    return (
        <div className="site-card-wrapper">
            <Row gutter={30}>
                <Col md={24} sm={24}>
                    <Card title="نمودار رزروها" bordered={false}>
                        <Chart3 />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OperatorDashboard;
