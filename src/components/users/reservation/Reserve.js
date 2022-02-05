import { useState, useEffect } from 'react';
import {
    Card,
    Col,
    Button,
    Form,
    Spin,
    Radio,
    Badge,
    Divider,
    Select,
    Checkbox,
    Modal,
    Alert,
    Space,
} from 'antd';
import notify from 'general/notify';
import axios from 'axios';
import Gallery from './Gallery';
import { getWelfareName } from 'general/Helper';
import { Link, Redirect } from 'react-router-dom';

const { Option } = Select;

const Reserve = ({ match, history }) => {
    const [welfareId, setWelfareId] = useState(null);
    const [welfareType, setWelfareType] = useState(null);
    const [message, setMessage] = useState(null);
    const [reservableDays, setReservableDays] = useState([]);
    const [reservableTimes, setReservableTimes] = useState([]);
    const [, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [daysLoading, setDaysLoading] = useState(true);
    const [timesLoading, setTimesLoading] = useState(false);
    const [clusterLoading, setClusterLoading] = useState(false);
    const [clusterName, setClusterName] = useState('');
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [clusterList, setClusterList] = useState([]);
    const [welfareName, setWelfareName] = useState('');
    const [finalStep, setFinalStep] = useState(false);
    const [companionCountList, setCompanionCountList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    const [selectedServicesList, setSelectedServicesList] = useState([]);
    const { url } = match;
    const [form] = Form.useForm();

    useEffect(() => {
        setReservableDays([]);
        setReservableTimes([]);
        setClusterList([]);
        setCompanionCountList([]);
        setSubmitButtonDisabled(true);
        setFinalStep(false);
        setWelfareType(null);

        form.resetFields();
        const type = url.split('/')[1]?.toUpperCase();

        setWelfareType(type);
        // get welfareId by url
        axios.post('Welfare/Get', { type }).then(({ data }) => {
            const welfareId = data[0].id;

            setWelfareId(welfareId);
            setWelfareName(getWelfareName(welfareId));

            if (welfareId === 2) {
                setClusterName('اتاق');
            } else if (welfareId === 4) {
                setClusterName('میز');
            }

            // get last message
            axios
                .post('Messaging/GetLast', { welfareId, isPublic: false })
                .then(({ data }) => {
                    setMessage(data);
                });
            // .then(() => setMessageLoading(false));
            // get reservable days of week
            axios
                .post('Reservation/GetReservableDayOfWeek', {
                    welfareId,
                })
                .then(({ data }) => {
                    if (!data.length) {
                        notify.error('روزی برای رزرو وجود ندارد');
                    }
                    setReservableDays(data);
                    setDaysLoading(false);
                })
                .catch((errorMessage) => notify.error(errorMessage));
        });
    }, [url]);

    const closeModal = () => {
        setIsModalVisible(false);
    };

    function onDayChange(e) {
        const selectedDay = e.target.value;
        setSelectedDay(selectedDay);
        setClusterList([]);

        setTimesLoading(true);
        // get scences
        axios
            .post('Reservation/GetReservable', {
                welfareId,
                dateFrom: selectedDay,
            })
            .then(({ data }) => {
                if (!data.length) {
                    notify.error('سانسی برای رزرو یافت نشد');
                } else {
                    setReservableTimes(data);
                }
            })
            .catch((errorMessage) => {
                notify.error(errorMessage);
            })
            .then(() => setTimesLoading(false));
    }

    // const onClusterChange = (e) => {
    //     const selectedTime = e.target.value;
    //     alert(selectedTime);
    //     // const capacity = clusterList.find()
    //     setFinalStep(true);
    //     setSelectedTime(selectedTime);
    //     // setSubmitButtonDisabled(false);
    // };

    const onClusterChange = (e) => {
        if (welfareId === 2) {
            const selectedClusterId = e.target.value;
            const selectedItem = clusterList.find(
                (item) => item?.welfareclusterId === selectedClusterId
            );

            setCompanionCountList([
                ...Array(parseInt(selectedItem?.clusterCapacity)).keys(),
            ]);
        }

        setFinalStep(true);
    };

    const onTimeChange = (e) => {
        const selectedTime = e.target.value;
        setSelectedTime(selectedTime);

        setClusterLoading(true);
        if (welfareId === 4 || welfareId === 2) {
            if (welfareId === 4) {
                setCompanionCountList([0, 1, 2]);
            }
            // get scences
            axios
                .post('WelfareCluster/Get', {
                    welfareId,
                    welfareType: 'none',
                    // dateFrom: selectedDay,
                })
                .then(({ data }) => {
                    if (!data.length) {
                        notify.error('موردی برای رزرو یافت نشد');
                    } else {
                        setClusterList(data);
                        // setSubmitButtonDisabled(true);
                    }
                })
                .catch((errorMessage) => {
                    notify.error(errorMessage);
                })
                .then(() => setClusterLoading(false));
        } else if (welfareId === 1) {
            setFinalStep(true);
            // setSubmitButtonDisabled(false);
        } else {
            axios
                .post('WelfareServices/Get', { welfareId })
                .then(({ data }) => {
                    setServiceList(data);
                })
                .catch((errorMessage) => notify.error(errorMessage));
            // .then(() => setLoading(false));
        }
    };

    const onFinish = (values) => {
        delete values.day;
        delete values.rule;

        axios
            .post('Reservation/New', values)
            .then(({ message }) => {
                notify.success(message);
                history.push(url.replace('reservation', 'gethistory'));
            })
            .catch((errorMessage) => notify.error(errorMessage));
    };

    const onRuleAcceptanceChange = (e) => {
        if (e.target.checked) {
            setSubmitButtonDisabled(false);
        } else {
            setSubmitButtonDisabled(true);
        }
    };

    const isEmptySelectedServices = (e) => {
        if (e.length) {
            setFinalStep(true);
            if (form.getFieldValue('rule')) {
                setSubmitButtonDisabled(false);    
            }
        } else {
            setSubmitButtonDisabled(true);
        }
    };

    return (
        <Col sm={24} xs={24} md={22} lg={19} xlg={12}>
            {message && (
                <>
                    <br />
                    <Alert
                        className="message-alert"
                        message={message.title}
                        description={message.body}
                        type="info"
                        showIcon
                        closable
                    />
                </>
            )}
            <Card
                title={`رزرواسیون ${welfareName}`}
                extra={[
                    // welfareId === 4 && (
                    <Button
                        size="small"
                        onClick={() => setIsModalVisible(true)}
                    >
                        {welfareId === 4
                            ? 'مشاهده منو و آلبوم'
                            : 'مشاهده آلبوم'}
                    </Button>,
                    // ),
                ]}
                bodyStyle={{ background: '#f9f9f9', marginTop: 0 }}
            >
                <Form onFinish={onFinish} form={form}>
                    {/* <Alert message="" type="info" /> */}
                    <Badge.Ribbon
                        text="انتخاب روز"
                        className="ribbon"
                        placement="start"
                        color="cyan"
                    ></Badge.Ribbon>
                    <div className="days-section">
                        <Spin delay={900} spinning={daysLoading}>
                            <Form.Item name="day" label="">
                                <Radio.Group onChange={onDayChange}>
                                    {reservableDays.map(
                                        ({
                                            shamsiDate,
                                            dayOfWeek,
                                            reserved,
                                        }) => {
                                            return (
                                                <Radio.Button
                                                    value={shamsiDate}
                                                    disabled={!reserved}
                                                >
                                                    <span className="day-of-week">
                                                        {dayOfWeek}
                                                        <br />
                                                        <br />
                                                        {shamsiDate}
                                                        {/* <span className="date">
                                                    </span> */}
                                                    </span>
                                                </Radio.Button>
                                            );
                                        }
                                    )}
                                </Radio.Group>
                            </Form.Item>
                        </Spin>
                    </div>
                    <br />
                    {reservableTimes.length ? (
                        <>
                            <br />
                            <Badge.Ribbon
                                text="انتخاب سانس"
                                className="ribbon"
                                placement="start"
                                color="cyan"
                            ></Badge.Ribbon>
                            <div className="days-section">
                                <Form.Item
                                    name="programId"
                                    label=""
                                    rules={[{ required: true }]}
                                >
                                    <Spin delay={900} spinning={timesLoading}>
                                        <Radio.Group onChange={onTimeChange}>
                                            {reservableTimes.map(
                                                (
                                                    {
                                                        startTime,
                                                        endTime,
                                                        reserved,
                                                        capacity,
                                                        dailyProgramId,
                                                        isActive,
                                                        isReservable,
                                                        genderAcceptance,
                                                    },
                                                    i
                                                ) => {
                                                    return (
                                                        <Radio.Button
                                                            value={
                                                                dailyProgramId
                                                            }
                                                            disabled={
                                                                !isReservable
                                                            }
                                                            style={{
                                                                background: `rgb(255, ${
                                                                    255 -
                                                                    (255 *
                                                                        reserved) /
                                                                        capacity
                                                                },${
                                                                    255 -
                                                                    (255 *
                                                                        reserved) /
                                                                        capacity
                                                                })`,
                                                            }}
                                                        >
                                                            <span className="day-of-week">
                                                                سانس
                                                                {`   ${++i}`}
                                                            </span>
                                                            <br />
                                                            <span className="day-of-week">
                                                                {`${endTime} - ${startTime}`}
                                                                <br />
                                                            </span>
                                                            <span className="detail">
                                                                {welfareId !==
                                                                    2 && [
                                                                    `گنجایش: ${capacity}`,
                                                                    <br />,
                                                                ]}

                                                                {`رزرو شده: ${reserved} `}
                                                                <br />
                                                                {welfareId ===
                                                                    1 &&
                                                                    (genderAcceptance ===
                                                                    1
                                                                        ? 'مردانه'
                                                                        : 'زنانه')}
                                                            </span>
                                                            <br />
                                                        </Radio.Button>
                                                    );
                                                }
                                            )}
                                        </Radio.Group>
                                    </Spin>
                                </Form.Item>
                            </div>
                        </>
                    ) : null}
                    <br />
                    {serviceList.length ? (
                        <>
                            <br />
                            <Badge.Ribbon
                                text="انتخاب سرویس"
                                className="ribbon"
                                placement="start"
                                color="cyan"
                            ></Badge.Ribbon>
                            <Form.Item name="servicesId" label="">
                                <Checkbox.Group
                                    onChange={isEmptySelectedServices}
                                >
                                    {serviceList.map((service) => (
                                        <>
                                            <Checkbox value={service.id}>
                                                <Space>
                                                    {service.serviceName}
                                                    <span className="small-divider">
                                                        ({service.price} تومان)
                                                    </span>
                                                    <span className="small-divider">
                                                        {service.comment}
                                                    </span>
                                                </Space>
                                            </Checkbox>
                                            <br />
                                        </>
                                    ))}
                                </Checkbox.Group>
                            </Form.Item>
                        </>
                    ) : null}
                    <br />
                    {clusterList.length ? (
                        <>
                            <br />
                            <Badge.Ribbon
                                // text={() => "انتخاب "+ clusterName}
                                text={'انتخاب ' + clusterName}
                                className="ribbon"
                                placement="start"
                                color="cyan"
                            ></Badge.Ribbon>
                            <div className="days-section">
                                <Form.Item
                                    name="welfareClusterId"
                                    label=""
                                    rules={[{ required: true }]}
                                >
                                    <Spin delay={900} spinning={clusterLoading}>
                                        <Radio.Group onChange={onClusterChange}>
                                            {clusterList.map(
                                                (
                                                    {
                                                        clusterCapacity,
                                                        clusterFa,
                                                        welfareclusterId,
                                                        clusterLock,
                                                    },
                                                    i
                                                ) => {
                                                    return (
                                                        <Radio.Button
                                                            value={
                                                                welfareclusterId
                                                            }
                                                            disabled={
                                                                clusterLock
                                                            }
                                                        >
                                                            <span className="day-of-week">
                                                                {clusterFa}
                                                                <span className="detail">
                                                                    {`گنجایش: ${clusterCapacity}`}
                                                                </span>
                                                            </span>
                                                            <br />
                                                        </Radio.Button>
                                                    );
                                                }
                                            )}
                                        </Radio.Group>
                                    </Spin>
                                </Form.Item>
                            </div>
                        </>
                    ) : null}

                    {finalStep ? (
                        <>
                            <Divider orientation="right" className="sm-font">
                                قسمت پایانی
                            </Divider>
                            <div className="days-section">
                                {(welfareId === 2 || welfareId === 4) && (
                                    <Form.Item
                                        name="companions"
                                        label="تعداد همراه"
                                        wrapperCol={{ xs: 24, lg: 5 }}
                                        rules={[{ required: true }]}
                                    >
                                        <Select>
                                            {companionCountList.map((item) => (
                                                <Option value={item}>
                                                    {item}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )}
                                <Form.Item
                                    name="rule"
                                    label={
                                        <>
                                            <Link
                                                to={url.replace(
                                                    'reservation',
                                                    'rule'
                                                )}
                                            >
                                                شرایط {welfareName} &nbsp;
                                            </Link>
                                            را میپذیرم
                                        </>
                                    }
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        onChange={onRuleAcceptanceChange}
                                    ></Checkbox>
                                </Form.Item>
                            </div>
                        </>
                    ) : null}

                    <div className="ant-card-footer">
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="wide-button"
                                disabled={submitButtonDisabled}
                            >
                                ثبت
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Card>
            <Modal
                title={welfareId === 4 ? 'مشاهده منو و آلبوم' : 'مشاهده آلبوم'}
                visible={isModalVisible}
                footer={null}
                onCancel={closeModal}
                width={1000}
                style={{ top: 30 }}
            >
                <Gallery type={welfareType} />
            </Modal>
        </Col>
    );
};

export default Reserve;
