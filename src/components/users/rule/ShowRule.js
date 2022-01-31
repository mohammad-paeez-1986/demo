import React, { useState, useEffect } from "react";
import { Card, Col, Spin } from "antd";
import axios from "axios";

const ShowRule = ({ match }) => {
    const [loading, setLoading] = useState(false);
    const [rule, setRule] = useState(null);
    const { url } = match;

    useEffect(() => {
        setLoading(true)
        const type = url.split("/")[1]?.toUpperCase();
        // get welfareId by url
        axios.post("Welfare/Get", { type }).then(({ data }) => {
            const welfareId = data[0].id;
            axios
                .post("Rule/GetLast", {
                    messageType: "rule",
                    welfareId,
                })
                .then(({ data }) => {
                    // console.log(data);
                    setRule(data);
                })
                // .catch((errorMessage) => notify.error(errorMessage))
                .then(() => setLoading(false));
        });
    }, [url]);

    return (
        <Col sm={24} xs={24} md={19} lg={16} xlg={12}>
            <Card title="شرایط استفاده">
                <Spin delay={900} spinning={loading}>
                    {rule ? (
                        <>
                            <h2>{rule.title || ''}</h2>
                            <p>{rule.body || ''}</p>
                        </>
                    ) : // (<h2>{rule.title}</h2>
                    // <p>{rule.body}</p>)
                    null}
                </Spin>
            </Card>
        </Col>
    );
};

export default ShowRule;
