import React, { useState, useEffect } from "react";
import { Card, Col, Carousel } from "antd";
import notify from "general/notify";
import axios from "axios";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const Banner = () => {
    const [galleryList, setGalleryList] = useState([]);
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <RightOutlined />,
        prevArrow: <LeftOutlined />,
    };

    useEffect(() => {
        axios
            .post("IO/GetList", { typeName: "BANNER" })
            .then(({ data }) => {
                setGalleryList(data);
            })
            .catch((errorMessage) => notify.error(errorMessage));
    }, []);

    return (
        <Col sm={24} xs={24} md={24} lg={24} xlg={12}>
            {/* <Card title="بنرها"> */}
            <div className="banner-album">
                <Carousel autoplay arrows {...settings}>
                    {galleryList.map(({ isActive, fileUri }) => {
                        if (isActive) {
                            return <img src={fileUri} alt="" />;
                        }
                    })}
                </Carousel>
            </div>
            {/* </Card> */}
        </Col>
    );
};

export default Banner;
