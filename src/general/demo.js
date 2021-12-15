import React, { useState, useEffect } from "react";
import { Card, Col, Form, Input, Spin, Button, Select, Radio } from "antd";
import axios from "axios";
import notify from "general/notify";


const AddWelfareCluster = () => {
    const [loading, setLoading] = useState()
    return (
        <Col sm={24} xs={24} md={19} lg={15} xlg={12}>
            <Card title="">
                <Spin spinning={loading}>
                </Spin>
            </Card>
        </Col>
    )
}

export default AddWelfareCluster
