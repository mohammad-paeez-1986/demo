import React, { useState, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Col, Carousel } from "antd";
import notify from "general/notify";
import axios from "axios";

const Gallery = () => {
    const [galleryList, setGalleryList] = useState([]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <RightOutlined />,
        prevArrow: <LeftOutlined />,
        autoplaySpeed: 30000,
    };

    useEffect(() => {
        axios
            .post("IO/GetList", { typeName: "CAFE" })
            .then(({ data }) => {
                setGalleryList(data);
            })
            .catch((errorMessage) => notify.error(errorMessage));
    }, []);

    return (
        <div className="modal-album">
            <Carousel autoplay arrows {...settings}>
                {galleryList.map(({ isActive, fileUri }) => {
                    if (isActive) {
                        return <img src={fileUri} alt="" />;
                    }
                })}
            </Carousel>
        </div>
    );
};

export default Gallery;
