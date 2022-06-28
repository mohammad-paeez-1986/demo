import React, { useEffect, useState } from 'react';
import { Card, Col, List, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import gym from 'images/gym.png';
import carwash from 'images/carwash.png';
import cafe from 'images/cafe.png';
import saloon from 'images/saloon.png';
import clinic from 'images/clinic.png';
import { getWelfareName } from 'general/Helper';
import axios from 'axios';

const ReservationLinks = ({ roleName }) => {
    const [activeWelfareList, setActiveWelfareList] = useState([]);

    useEffect(() => {
        const welfareList = ['cafe', 'gym', 'saloon', 'carwash', 'clinic'];
        let activeWelfareArray = [];
        axios.post('system/menu').then(({ data }) => {
            data.forEach(({ moduleNameEn }) => {
                if (welfareList.indexOf(moduleNameEn) > -1) {
                    activeWelfareArray.push(moduleNameEn);
                }
            });
            setActiveWelfareList(activeWelfareArray)
        });

    }, []);

    const data = [
        {
            link: 'cafe/reservation',
            image: cafe,
            name: 'کافه',
            nameEn: 'cafe',
        },
        {
            link: 'carwash/reservation',
            image: carwash,
            name: 'کارواش',
            nameEn: 'carwash',
        },
        {
            link: 'saloon/reservation',
            image: saloon,
            name: 'اتاق جلسات',
            nameEn: 'saloon',
        },
        {
            link: 'gym/reservation',
            image: gym,
            name: 'باشگاه ورزشی',
            nameEn: 'gym',
        },
        {
            link: 'clinic/reservation',
            image: clinic,
            name: 'کلینیک منابع انسانی',
            nameEn: 'clinic',
        },
    ];

    return (
        <List
            grid={{
                gutter: 16,
                column: 5,
                xs: 1,
                sm: 2,
            }}
            dataSource={data}
            renderItem={({ link, image, name, nameEn }) => (
                <List.Item>
                    <Link
                        to={link}
                        className={
                            activeWelfareList.indexOf(nameEn) > -1
                                ? ''
                                : 'inactive-link'
                        }
                    >
                        <Tooltip title={`درخواست رزرو ${name}`} color='orange'>
                            <Card title='' className='iconsList'>
                                <img src={image} alt={name} />
                            </Card>
                        </Tooltip>
                    </Link>
                </List.Item>
            )}
        />
    );
};

export default ReservationLinks;
