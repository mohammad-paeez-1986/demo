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
    Popover,
} from 'antd';
import notify from 'general/notify';
import axios from 'axios';
import Gallery from './Gallery';
import { getWelfareName, formatNumber } from 'general/Helper';
import { Link, Redirect } from 'react-router-dom';
import LastMessages from 'components/users/dashboard/LastMessages';
import ShowReserveRule from 'components/users/rule/ShowReserveRule';

const { Option } = Select;

const ClinicReservation = ({ match, history }) => {
    const [welfareId, setWelfareId] = useState(5);
    const [welfareType, setWelfareType] = useState('clinic');
    const [clusterName, setClusterName] = useState('مشاور');
    const [message, setMessage] = useState(null);
    const [reservableDays, setReservableDays] = useState([]);
    const [reservableTimes, setReservableTimes] = useState([]);
    const [, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [daysLoading, setDaysLoading] = useState(false);
    const [timesLoading, setTimesLoading] = useState(false);
    const [clusterLoading, setClusterLoading] = useState(true);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [clusterList, setClusterList] = useState([]);
    const [welfareName, setWelfareName] = useState('');
    const [finalStep, setFinalStep] = useState(false);
    const [companionCountList, setCompanionCountList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    // const [selectedServicesList, setSelectedServicesList] = useState([]);
    const [ruleContent, setRuleContent] = useState('');
    const [ruleLoading, setRuleLoading] = useState();
    const [modalTitle, setModalTitle] = useState('');
    const { url } = match;
    const [form] = Form.useForm();

    useEffect(() => {
        setReservableDays([]);
        setReservableTimes([]);
        setClusterList([]);
        setCompanionCountList([]);
        setSubmitButtonDisabled(true);
        setFinalStep(false);

        form.resetFields();

        axios
            .post('WelfareCluster/Get', {
                welfareId: 5,
                welfareType: 'none',
            })
            .then(({ data }) => {
                if (!data.length) {
                    notify.error('موردی برای رزرو یافت نشد');
                } else {
                    setClusterList(data);
                    // document.getElementById('cluster-place').scrollIntoView();
                    // setSubmitButtonDisabled(true);
                }
            })
            .catch((errorMessage) => {
                notify.error(errorMessage);
            })
            .then(() => setClusterLoading(false));
    }, [url]);

    const openModal = (title, type) => {
        setModalTitle(title);
        setWelfareType(type);
        setIsModalVisible(true);
    };

    const getRuleContent = () => {
        setRuleLoading(true);
        axios
            .post('Rule/GetLast', {
                messageType: 'rule',
                welfareId,
            })
            .then(({ data }) => {
                const content = (
                    <div style={{ maxWidth: 600 }}>
                        <h2>{data.title || ''}</h2>
                        <p>
                            {data.body.split('\n').map((item, idx) => (
                                <span key={idx}>
                                    {item}
                                    <br />
                                </span>
                            ))}
                        </p>
                    </div>
                );
                setRuleContent(content);
            })
            // .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setRuleLoading(false));
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    function onDayChange(e) {
        const selectedDay = e.target.value;
        setSelectedDay(selectedDay);

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
                document.getElementById('time-place').scrollIntoView();
            })
            .catch((errorMessage) => {
                notify.error(errorMessage);
            })
            .then(() => setTimesLoading(false));
    }

    const onClusterChange = (e) => {

        setReservableTimes([])        
        setReservableDays([])
        setFinalStep(false)
        setSubmitButtonDisabled(true)

        form.setFieldsValue({
            day: null,
            rule:false
        });
        
        const selectedClusterId = e.target.value;
        const selectedItem = clusterList.find(
            (item) => item?.welfareclusterId === selectedClusterId
        );

        setDaysLoading(true);
        // get scences
        axios
            .post('Reservation/GetReservableDayOfWeekCluster', {
                welfareId: 5,
                welfareClusterId: selectedItem.welfareclusterId,
            })
            .then(({ data }) => {
                if (!data.length) {
                    notify.error('سانسی برای رزرو یافت نشد');
                } else {
                    setReservableDays(data);
                }
                document.getElementById('days-place').scrollIntoView();
            })
            .catch((errorMessage) => {
                notify.error(errorMessage);
            })
            .then(() => setDaysLoading(false));
    };

    const onTimeChange = (e) => {
        const selectedTime = e.target.value;
        setSelectedTime(selectedTime);
        setFinalStep(true);
        // setSubmitButtonDisabled(false);
    };

    const onFinish = (values) => {
        delete values.day;
        delete values.rule;

        values.servicesId = [];
        values.companions = 0

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
            {/* <video
                src='/mci-clinic.mp4'
                oontrols
                autoplay='true'
                style={{ width: '100%', height: 'auto' }}
            ></video> */}
            <LastMessages public={false} welfareId={welfareId} />
            <ShowReserveRule welfareId={welfareId} />
            <br />

            <Card
                title='رزرواسیون کلینیک منابع انسانی'
                extra={[
                    <Button
                        size='small'
                        onClick={() => openModal('اطلاعات مشاورین', 'CLINIC')}
                    >
                        اطلاعات مشاورین
                    </Button>,
                    // ),
                ]}
            >
                <Form onFinish={onFinish} form={form}>
                    {clusterList.length ? (
                        <>
                            <Badge.Ribbon
                                // text={() => "انتخاب "+ clusterName}
                                text={'انتخاب مشاور'}
                                className='ribbon'
                                placement='start'
                                color='cyan'
                            ></Badge.Ribbon>
                            <div className='labels-section cluster'>
                                <div>
                                    <Form.Item
                                        name='welfareClusterId'
                                        label=''
                                        rules={[{ required: true }]}
                                    >
                                        <Spin
                                            delay={900}
                                            spinning={clusterLoading}
                                        >
                                            <Radio.Group
                                                onChange={onClusterChange}
                                            >
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
                                                                <span className='day-of-week'>
                                                                    {clusterFa}
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
                            </div>
                        </>
                    ) : null}

                    <br id='days-place' />
                    {reservableDays.length ? (
                        <>
                            <Badge.Ribbon
                                text='انتخاب روز'
                                className='ribbon'
                                placement='start'
                                color='cyan'
                            ></Badge.Ribbon>
                            <div className='labels-section'>
                                <Spin delay={900} spinning={daysLoading}>
                                    <Form.Item name='day' label=''>
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
                                                            <span className='day-of-week'>
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
                        </>
                    ) : null}

                    <br id='time-place' />
                    {reservableTimes.length ? (
                        <>
                            <br />
                            <Badge.Ribbon
                                text='انتخاب سانس'
                                className='ribbon'
                                placement='start'
                                color='cyan'
                            ></Badge.Ribbon>
                            <div className='labels-section'>
                                <Form.Item
                                    name='programId'
                                    label=''
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
                                                            <span className='day-of-week'>
                                                                سانس
                                                                {`   ${++i}`}
                                                            </span>
                                                            <br />
                                                            <span className='day-of-week'>
                                                                {`${endTime} - ${startTime}`}
                                                                <br />
                                                            </span>
                                                            {/* <span className='detail'>
                                                                گنجایش:
                                                                {capacity}
                                                                <br />
                                                                {`رزرو شده: ${reserved}`}
                                                                <br />
                                                            </span> */}
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
                            <Divider orientation='right' className='sm-font'>
                                قسمت پایانی
                            </Divider>
                            <div className='labels-section'>
                                {(welfareId === 2 || welfareId === 4) && (
                                    <Form.Item
                                        name='companions'
                                        label='تعداد همراه'
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
                                    name='rule'
                                    label={
                                        <>
                                            <Popover
                                                // title='Are you sure to delete this task?'
                                                // onConfirm={confirm}
                                                // onCancel={cancel}
                                                onClick={getRuleContent}
                                                trigger='click'
                                                content={
                                                    <Spin
                                                        spinning={ruleLoading}
                                                    >
                                                        {ruleContent}
                                                    </Spin>
                                                }
                                            >
                                                <a>
                                                    شرایط {welfareName} &nbsp;
                                                </a>
                                            </Popover>
                                            {/* <a
                                                to={url.replace(
                                                    'reservation',
                                                    'rule'
                                                )}
                                            > */}
                                            را میپذیرم
                                        </>
                                    }
                                    valuePropName='checked'
                                >
                                    <Checkbox
                                        onChange={onRuleAcceptanceChange}
                                    ></Checkbox>
                                </Form.Item>
                            </div>
                        </>
                    ) : null}

                    <div className='ant-card-footer'>
                        <Form.Item>
                            <Button
                                type='primary'
                                htmlType='submit'
                                className='wide-button'
                                disabled={submitButtonDisabled}
                            >
                                ثبت
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Card>
            <Modal
                title={modalTitle}
                visible={isModalVisible}
                footer={null}
                onCancel={closeModal}
                width={1000}
                style={{ top: 30 }}
                destroyOnClose={true}
            >
                <Gallery type={welfareType} />
            </Modal>
        </Col>
    );
};

export default ClinicReservation;
