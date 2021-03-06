import { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Form,
    Select,
    Input,
    List,
    Spin,
    Popconfirm,
    Upload,
    Image,
} from "antd";
import axios from "axios";
import notify from "general/notify";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { getNumeric } from "general/Helper";

const { Option } = Select;
const { Dragger } = Upload;

const Images = () => {
    const [loading, setLoading] = useState(true);
    const [typeList, setTypeList] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [imagesList, setImagesList] = useState([]);
    const [imagesListLoading, setImagesListLoading] = useState(false);
    const [selectedImageSrc, setSelectedImageSrc] = useState(null);

    useEffect(() => {
        axios
            .post("IO/GetTypeNames")
            .then(({ data }) => {
                setTypeList(data);
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    }, []);

    const onTypeChange = (value = selectedType) => {
        setSelectedType(value);
        setSelectedImageSrc(null);

        setImagesListLoading(true);
        axios
            .post("IO/GetList", { typeName: value })
            .then(({ data }) => {
                setImagesList(data.filter((item) => item.isActive === true));
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setImagesListLoading(false));
    };

    const onSelectImage = (id) => {
        setSelectedImageSrc(null);
        let newImagesList;
        newImagesList = imagesList.map((item) => {
            if (item.id === id) {
                setSelectedImageSrc(item.fileUri);
                return { ...item, selected: true };
            } else {
                return { ...item, selected: false };
            }
        });

        setImagesList(newImagesList);
    };

    const onImageDelete = (id) => {
        setImagesListLoading(true);
        axios
            .post("IO/Modify", { id })
            .then(({ message }) => {
                onTypeChange();
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setImagesListLoading(false));
    };

    const onFinish = (values) => {
        const formData = new FormData();
        formData.append("OrderId", values.OrderId || 1);
        formData.append("TypeName", values.TypeName);
        formData.append("title", values.title || '');
        formData.append("file", values.file.file);

        window.headers = {
            "content-type": "multipart/form-data",
        };

        setLoading(true);
        axios
            .post("IO/Upload", formData)
            .then(({ message }) => {
                onTypeChange();
            })
            .catch((errorMessage) => notify.error(errorMessage))
            .then(() => setLoading(false));
    };

    const uploadProps = {
        maxCount: 1,
        beforeUpload: () => {
            return false;
        },
    };

    return (
        <Row gutter={16}>
            <Col sm={24} xs={24} md={19} lg={12} xlg={12}>
                <Card title="????????????????">
                    <Form
                        labelCol={{ xs: 7, md: 6, lg: 6, xlg: 5 }}
                        onFinish={onFinish}
                        scrollToFirstError={true}
                    >
                        <Form.Item name="title" label="??????????">
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="TypeName"
                            label="???????? ????????"
                            rules={[{ required: true }]}
                        >
                            <Select onChange={onTypeChange}>
                                {typeList.map((item) => (
                                    <Option value={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {selectedType === "SPLASH" && (
                            <Form.Item
                                name="OrderId"
                                label="??????????"
                                rules={[{ required: true }]}
                                normalize={(val) => getNumeric(val)}
                            >
                                <Input className="ltr" maxLength={2} />
                            </Form.Item>
                        )}

                        <Form.Item
                            name="file"
                            label="??????"
                            rules={[{ required: true }]}
                        >
                            <Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-hint">
                                    ?????????? ???? ?????????????? ???? ?????????? ??????????
                                </p>
                            </Dragger>
                        </Form.Item>
                        <div className="ant-card-footer">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="wide-button"
                                >
                                    ??????
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Card>
            </Col>

            <Col sm={24} xs={24} md={19} lg={12} xlg={12}>
                <Card title="????????????">
                    <Spin delay={900} spinning={imagesListLoading}>
                        <List
                            className="image-list"
                            dataSource={imagesList}
                            renderItem={({
                                fileUri,
                                title,
                                id,
                                orderId,
                                typeName,
                                selected = false,
                            }) => (
                                <List.Item
                                    className={selected && "selected"}
                                    onClick={() => onSelectImage(id)}
                                    key={id}
                                    actions={[
                                        <div className="list-action-left">
                                            <Popconfirm
                                                title="?????? ?????????? ????????????"
                                                onConfirm={() =>
                                                    onImageDelete(id)
                                                }
                                            >
                                                <DeleteOutlined />
                                            </Popconfirm>
                                        </div>,
                                    ]}
                                >
                                    {typeName !== "SPLASH"
                                        ? title
                                            ? title
                                            : "???????? ??????????"
                                        : title
                                        ? title + `( ??????????: ${orderId})`
                                        : `???????? ?????????? ( ??????????: ${orderId})`}
                                </List.Item>
                            )}
                        />
                        <div className="image-show">
                            <Image
                                src={selectedImageSrc}
                                fallback="data:image/png;base64,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"
                            />
                        </div>
                    </Spin>
                </Card>
            </Col>
        </Row>
    );
};

export default Images;
