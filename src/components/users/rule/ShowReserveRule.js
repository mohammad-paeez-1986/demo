import React, { useState, useEffect } from 'react';
import { Card, Col, Spin } from 'antd';
import axios from 'axios';
import notify from 'general/notify';

const ShowReserveRule = ({ welfareId }) => {
    const [loading, setLoading] = useState(false);
    const [rule, setRule] = useState(null);

    useEffect(() => {
        setLoading(true);
        // get welfareId by url
        axios
            .post('Rule/GetLast', {
                messageType: 'rule',
                welfareId,
            })
            .then(({ data }) => {
                setRule(data);
            })
            // .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    }, [welfareId]);

    return (
        <>
            {rule ? (
                <Col>
                    <Card title='' size='small'>
                        <Spin delay={900} spinning={loading}>
                            <>
                                <h2>{rule.title || ''}</h2>
                                <p>
                                    {rule.body.split('\n').map((item, idx) => (
                                        <span key={idx}>
                                            {item}
                                            <br />
                                        </span>
                                    ))}
                                </p>
                            </>
                        </Spin>
                    </Card>
                </Col> // (<h2>{rule.title}</h2>
            ) : // <p>{rule.body}</p>)
            null}
        </>
    );
};

export default React.memo(ShowReserveRule);
