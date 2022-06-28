import React, { useState, useEffect } from 'react';
import { Card, Col, List, Spin, Alert } from 'antd';
import axios from 'axios';
import { getWelfareName } from 'general/Helper';

const LastMessages = ({ isPublic, welfareId }) => {
    const [lastPublicMessage, setLastPublicMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const postData = isPublic
            ? { isPublic: true }
            : { isPublic: false, welfareId };

        axios
            .post('Messaging/GetLast', postData)
            .then(({ data }) => {
                if (data) {
                    data.body = data.body.split('\n').map((item, idx) => (
                        <span key={idx}>
                            {item}
                            <br />
                        </span>
                    ));
                    // console.log(data);
                    setLastPublicMessage(data);
                }
            })
            .then(() => setLoading(false));
    }, [welfareId]);

    return (
        <Col sm={24} xs={24} md={24} lg={24} xlg={12}>
            {/* <Spin delay={900} spinning={loading} size="small"> */}
            {lastPublicMessage && (
                <>
                    <br />
                    <Alert
                        className='message-alert'
                        message={lastPublicMessage.title}
                        description={lastPublicMessage.body}
                        type='error'
                        showIcon
                        closable
                    />
                </>
            )}
            {/* </Spin> */}
        </Col>
    );
};

export default React.memo(LastMessages);
