import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Space,
  Button,
  Select,
  Upload,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import type { GetProp, UploadFile, UploadProps } from "antd";
import sendFileToServer from "../../../api/sendFileToServer";
import {
  getAuthorization,
  useUserContext,
} from "../../../utilities/authorization";

const uploadAttachment = async (
  fileList: UploadFile[],
  reportId: string,
  token: string
) => {
  const form = new FormData();
  await Promise.all(
    fileList.map(async (file) => {
      if (file.originFileObj) {
        form.append("reportAttachment", file.originFileObj as Blob);
      }
    })
  );

  sendFileToServer(
    form,
    `/api/articles/uploadReportAttachment/${reportId}`,
    token
  );
};

const NewReport = () => {
  const { TextArea } = Input;
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const userContext = useUserContext();
  const router = useRouter();

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const onFinish = useCallback(
    async (values: any) => {
      const { attachment: reportAttachment, ...reportData } = values;
      const response: AxiosResponse<T> = await axios({
        method: "post",
        url: process.env.BE_BASEURL + "/api/reports",
        data: reportData,
        ...getAuthorization(userContext?.token || ""),
      }).catch((e) => {
        messageApi.error("Maaf, sedang terjadi gangguan");
        return e.response;
      });

      if (response?.status === 200) {
        uploadAttachment(fileList, response.data._id, userContext?.token || "");
        messageApi.success("Terima kasih, laporan anda telah kami terima");
        router.reload();
      }
    },
    [fileList, messageApi, router, userContext?.token]
  );

  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      {contextHolder}
      <Row>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ minWidth: 600, maxWidth: 900, margin: "0px" }}
            autoComplete="off"
            labelAlign="left"
            labelWrap
            onFinish={onFinish}
          >
            <Card
              title="Silahkan sampaikan aduan anda di form berikut"
              extra={null}
            >
              <Form.Item label="Jenis Laporan" name="type">
                <Select
                  options={[
                    { value: "kebersihan", label: "Kebersihan" },
                    { value: "keamanan", label: "Keamanan" },
                    { value: "lainLain", label: "Lain-lain" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Detail Laporan" name="description">
                <TextArea placeholder="Silahkan sampaikan " />
              </Form.Item>
              <Form.Item label="Lampiran Laporan" name="attachment">
                <Upload
                  accept=".jpg,.jpeg,.png,.mp4"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {fileList.length >= 5 ? null : (
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                  )}
                </Upload>
              </Form.Item>
              <center>
                <Button type="primary" htmlType="submit">
                  Simpan
                </Button>
              </center>
            </Card>
          </Form>
        </Col>
      </Row>
    </Space>
  );
};

export default NewReport;
