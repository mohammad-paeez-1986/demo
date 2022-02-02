import React from 'react';
import { Card, Col, List, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import gym from 'images/gym.png';
import carwash from 'images/carwash.png';
import cafe from 'images/cafe.png';
import saloon from 'images/saloon.png';
import { getWelfareName } from 'general/Helper';

const ReservationLinks = () => {
    const data = [
        {
            link: 'cafe/reservation',
            image: cafe,
            name: 'کافه',
        },
        {
            link: 'carwash/reservation',
            image: carwash,
            name: 'کارواش',
        },
        {
            link: 'saloon/reservation',
            image: saloon,
            name: 'اتاق جلسات',
        },
        {
            link: 'gym/reservation',
            image: gym,
            name: 'باشگاه ورزشی',
        },
    ];

    return (
        <List
            grid={{
                gutter: 16,
                column: 4,
                xs: 1,
                sm: 2,
            }}
            dataSource={data}
            renderItem={({ link, image, name }) => (
                <List.Item>
                    <Link to={link}>
                        <Tooltip title={`درخواست رزرو ${name}`} color="orange">
                            <Card title="" className="iconsList">
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
