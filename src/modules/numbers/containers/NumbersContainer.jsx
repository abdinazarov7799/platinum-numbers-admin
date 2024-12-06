import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Modal, Pagination, Row, Select, Space, Table, Upload} from "antd";
import {get} from "lodash";
import {EditOutlined, UploadOutlined} from "@ant-design/icons";
import Container from "../../../components/Container.jsx";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import NumberEdit from "../components/NumberEdit.jsx";
import config from "../../../config.js";

const NumbersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState(null);
    const [status, setStatus] = useState(null);
    const [type, setType] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.number_list,
        url: URLS.number_list,
        params: {
            params: {
                size: 10,
                status,
                type
            }
        },
        page
    });

    const { mutate:fileUpload } = usePostQuery({
        listKeyId: KEYS.number_list,
    });

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Type"),
            dataIndex: "type",
            key: "type",
        },
        {
            title: t("Phone number"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status",
        },
        {
            title: t("Edit"),
            key: "edit",
            width: 50,
            render: (data) => (
                <Button icon={<EditOutlined />} onClick={() => setSelected(data)} />
            )
        },
    ]

    const customRequest = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);
        fileUpload(
            { url: URLS.upload_file, attributes: formData, config: { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' } } },
            {
                onSuccess: () => {
                    onSuccess(true);
                },
                onError: (err) => {
                    onError(err);
                },
            }
        );
    };

    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Modal
                    title={get(selected,'phoneNumber')}
                    open={!!selected}
                    onCancel={() => {setSelected(null)}}
                    footer={null}
                    width={800}
                >
                    <NumberEdit data={selected} setSelected={setSelected}/>
                </Modal>

                <Space size={"middle"}>
                    <Select
                        style={{width: 200}}
                        options={Object.values(config.STATUSES)?.map(status => ({label: t(status), value: status}))}
                        allowClear
                        onSelect={(e) => setStatus(e)}
                        onClear={() => setStatus(null)}
                        placeholder={t("Status")}
                    />
                    <Select
                        style={{width: 200}}
                        options={Object.values(config.TYPES)?.map(type => ({label: t(type), value: type}))}
                        allowClear
                        onSelect={(e) => setType(e)}
                        onClear={() => setType(null)}
                        placeholder={t("Type")}
                    />
                    <Upload
                        accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"}
                        multiple={false}
                        customRequest={customRequest}
                        showUploadList={{showRemoveIcon:false}}
                    >
                        <Button icon={<UploadOutlined />} type={"primary"}>{t("Upload excel file")}</Button>
                    </Upload>
                </Space>

                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />

                <Row justify={"end"} style={{marginTop: 10}}>
                    <Pagination
                        current={page+1}
                        onChange={(page) => setPage(page - 1)}
                        total={get(data,'data.totalPages') * 10 }
                        showSizeChanger={false}
                    />
                </Row>
            </Space>
        </Container>
    );
};

export default NumbersContainer;