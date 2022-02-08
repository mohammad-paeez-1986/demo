import { useState, useEffect } from 'react';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import AddDailyProgramModal from './AddDailyProgramModal';
import { Calendar, DateObject } from 'react-multi-date-picker';
import {
    // Card,
    // Col,
    Button,
    Space,
    Form,
    Modal,
    Table,
    Spin,
    Popconfirm,
} from 'antd';
import notify from 'general/notify';
import axios from 'axios';
import { getDateFromObject } from 'general/Helper';
import {
    CloseOutlined,
    CheckOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
// const weekDays = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه"]

const AddDailyProgram = ({ match }) => {
    const [date, setDate] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDayProgramList, setSelectedDayProgramList] = useState([]);
    const [welfareId, setWelfareId] = useState(null);
    const [copyDaysList, setCopyDaysList] = useState([]);
    const [copyBoxVisible, setCopyBoxVisible] = useState('hide');
    const [copyButtonDisabled, setCopyButtonDisabled] = useState(true);
    const [doCopyButtonVisible, setDoCopyButtonVisible] = useState('hide');
    const [isSelectingDays, setIsSelectingDays] = useState(false);
    const [holidaysList, setHolidaysList] = useState([]);
    const { url } = match;

    const resetCopyBox = () => {
        setDate(null);
        setCopyDaysList([]);
        setDoCopyButtonVisible('hide');
        setCopyBoxVisible('hide');
        setCopyButtonDisabled(true);
        setIsSelectingDays(false);
        setSelectedDayProgramList([]);
        setHolidaysList([]);
    };

    useEffect(() => {
        resetCopyBox();

        const today = new DateObject({ calendar: persian, locale: persian_fa });
        const type = url.split('/')[1]?.toUpperCase();
        axios.post('Welfare/Get', { type }).then(({ data }) => {
            setWelfareId(data[0].id);
            onDayChange(today, false, data[0].id);
        });

        axios
            .post('Calendar/Get', { shamsiDate: '0', description: 'all' })
            .then(({ data }) => {
                const holidaysList = data.map((item) => item.shamsiDate);
                setHolidaysList(holidaysList);
            });

        return () => {
            setIsSelectingDays(false);
            console.log(copyDaysList);
        };
    }, [url]);

    const onDayChange = (date, isObject = false, sentWelfareId = false) => {
        const validWelfareId = !sentWelfareId ? welfareId : sentWelfareId;

        setSelectedDayProgramList([]);

        let selectedDate;
        if (!isObject) {
            selectedDate = getDateFromObject(date);
            setDate(selectedDate);
        } else {
            selectedDate = date;
        }

        if (!sentWelfareId) {
            if (isSelectingDays) {
                copyProgram(null, selectedDate);
                return;
            }
        }

        setLoading(true);

        axios
            .post('Reservation/GetReservable', {
                dateFrom: selectedDate,
                welfareId: validWelfareId,
            })
            .then(({ data }) => {
                if (data.length) {
                    setCopyButtonDisabled(false);
                } else {
                    setCopyButtonDisabled(true);
                }

                setSelectedDayProgramList(data);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const copyProgram = (e, selectedDate = null) => {
        const addingDate = selectedDate || date;
        const today = new DateObject({ calendar: persian });

        if (copyDaysList.length >= 10) {
            notify.warning('حداکثر ده مورد برای کپی مجاز است');
            return;
        }

        if (copyDaysList.length > 0) {
            setDoCopyButtonVisible('show');
        }

        if (addingDate) {
            if (copyDaysList.length > 0) {
                if (addingDate < today.format()) {
                    notify.error('روزهای گذشته قابل انتخاب نیست');
                    return;
                }
            }
            setCopyButtonDisabled(true);
            setIsSelectingDays(true);
            setCopyBoxVisible('show');
            setCopyDaysList([...new Set([...copyDaysList, addingDate])]);
        }
    };

    const cancelCopyDays = () => {
        setDate(copyDaysList[0]);
        setCopyBoxVisible('hide');
        setCopyButtonDisabled(false);
        setIsSelectingDays(false);
        setDoCopyButtonVisible('hide');
        setCopyDaysList([]);
    };

    const copyDays = () => {
        let values = {};
        values.shamsiDateSource = copyDaysList[0];
        copyDaysList.shift();
        values.shamsiDates = copyDaysList;

        setLoading(true);
        axios
            .post('DailyProgram/CopyDaily', values)
            .then(({ message }) => {
                notify.success(message);
                resetCopyBox();
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    const onDeleteProgram = (id) => {
        setLoading(true);
        axios
            .post('DailyProgram/Remove', {
                programId: id,
            })
            .then(() => {
                let newSelectedDayProgramList;

                newSelectedDayProgramList = selectedDayProgramList.filter(
                    (item) => item.dailyProgramId !== id
                );
                setSelectedDayProgramList(newSelectedDayProgramList);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    const columns = [
        {
            title: 'گنجایش',
            dataIndex: 'capacity',
            key: 'capacity',
        },
        {
            title: 'وی آی پی',
            key: 'isVip',
            // className: "",
            render: (record) =>
                record.isVip ? (
                    <CheckOutlined className="green" />
                ) : (
                    <CloseOutlined className="red" />
                ),
        },
        {
            title: 'زمان سانس',
            key: 'id',
            render: ({ startTime, endTime }) => `${endTime} - ${startTime}`,
        },
        {
            title: 'جنیست',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'حذف',
            className: 'act-icon delete',
            onCell: (record) => {
                // console.log(record.id);
            },
            render: ({ dailyProgramId }) => (
                <Popconfirm
                    title="آیا مطمئن هستید؟"
                    onConfirm={() => onDeleteProgram(dailyProgramId)}
                >
                    <DeleteOutlined />
                </Popconfirm>
            ),
        },
    ];
    return (
        <>
            {/* <Col sm={24} xs={24} md={19} lg={15} xlg={12}> */}
            <Spin delay={900} spinning={loading}>
                {/* <Card title="ثبت برنامه جدید"> */}
                <div id="large-calendar">
                    <Calendar
                        calendar={persian}
                        locale={persian_fa}
                        calendarPosition="bottom-right"
                        weekDays={weekDays}
                        onChange={onDayChange}
                        value={date}
                        format={'YYYY/MM/DD'}
                        mapDays={({ date }) => {
                            let props = {};
                            let isWeekend =
                                date.weekDay.index === 6 ||
                                date.weekDay.index === 5;

                            if (
                                holidaysList.includes(
                                    getDateFromObject(date)
                                ) ||
                                isWeekend
                            )
                                return {
                                    disabled: true,
                                    style: { color: '#f30' },
                                    onClick: () =>
                                        notify.error('این روز تعطیل می  باشد'),
                                };
                        }}
                    />
                </div>
                <br />
                <Table
                    bordered
                    columns={columns}
                    pagination={{
                        hideOnSinglePage: true,
                    }}
                    dataSource={selectedDayProgramList}
                    loading={loading}
                    scroll={{ x: true }}
                />
                <div className="ant-card-footer">
                    <Space>
                        <Button
                            onClick={() => setIsModalVisible(true)}
                            type="primary"
                            htmlType="submit"
                            className="wide-button"
                        >
                            افزودن برنامه
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="wide-button"
                            onClick={copyProgram}
                            disabled={copyButtonDisabled}
                        >
                            {!isSelectingDays ? 'کپی برنامه' : 'درحال انتخاب'}
                        </Button>
                    </Space>
                </div>
                {/* </Card> */}
            </Spin>

            <Modal
                title="افزودن برنامه"
                visible={isModalVisible}
                footer={null}
                destroyOnClose={true}
                onCancel={closeModal}
            >
                <AddDailyProgramModal
                    date={date}
                    onSetNewProgram={onDayChange}
                    closeModal={closeModal}
                    welfareId={welfareId}
                />
            </Modal>
            {/* </Col> */}
            <ul className={`copy-days-box ${copyBoxVisible}`}>
                {copyDaysList.map((item) => {
                    return <li>{item}</li>;
                })}
                <li className={`copy-button ${doCopyButtonVisible}`}>
                    <Button
                        type="primary"
                        size="small"
                        block
                        onClick={copyDays}
                    >
                        کپی کردن
                    </Button>
                </li>
                <li className="cancel-copy-button">
                    <Button
                        type="primary"
                        size="small"
                        danger
                        block
                        onClick={cancelCopyDays}
                    >
                        لغو
                    </Button>
                </li>
            </ul>
        </>
    );
};

export default AddDailyProgram;
