import React, {useEffect} from 'react';
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Select} from "antd";
import {useTranslation} from "react-i18next";
import {get} from "lodash";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
import config from "../../../config.js";

const EditNumber = ({setSelected,data}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const {mutate,isLoading} = usePatchQuery({
        listKeyId: KEYS.number_list
    })

    useEffect(() => {
        form.setFieldsValue({
            ...data
        });
    }, [data]);

    const onFinish = (values) => {
        mutate(
            { url: `${URLS.number_edit}/${get(data,'id')}`, attributes: values },
            {
                onSuccess: () => {
                    setSelected(null);
                },
            }
        );
    };
    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item label={t("Status")} name={"status"}>
                    <Select
                        options={Object.values(config.STATUSES)?.map(status => ({label: t(status), value: status}))}
                        placeholder={t("Status")}
                    />
                </Form.Item>

                <Form.Item label={t("Type")} name={"type"}>
                    <Select
                        options={Object.values(config.TYPES)?.map(type => ({label: t(type), value: type}))}
                        placeholder={t("Type")}
                    />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading}>
                        {t("Edit")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditNumber;