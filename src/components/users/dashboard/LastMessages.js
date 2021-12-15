import React, { useState, useEffect } from "react";
import { Card, Col, List, Spin, Alert } from "antd";
import axios from "axios";
import { getWelfareName } from "general/Helper";

const LastMessages = () => {
    const [lastPublicMessage, setLastPublicMessage] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .post("Messaging/GetLast", { isPublic: true })
            .then(({ data }) => {
                setLastPublicMessage(data);
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <Col sm={24} xs={24} md={24} lg={24} xlg={12}>
            {/* <Spin delay={900} spinning={loading} size="small"> */}
            {lastPublicMessage && (
                <>
                    <br />
                    <Alert
                        className="message-alert"
                        message={lastPublicMessage.title}
                        description={lastPublicMessage.body}
                        type="info"
                        showIcon
                        closable
                    />
                </>
            )}
            {/* </Spin> */}
        </Col>
    );
};

export default LastMessages;
