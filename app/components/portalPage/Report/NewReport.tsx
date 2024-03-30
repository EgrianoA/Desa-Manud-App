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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import type { GetProp, UploadFile, UploadProps } from "antd";

const NewReport = () => {
  const { TextArea } = Input;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const router = useRouter();

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const onFinish = useCallback(
    async (values: any) => {
      console.log(values);
      console.log(fileList);
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("attachment", file.originFileObj);
      });

      formData.append("type", values.type);
      formData.append("content", values.content);
      console.log(formData);
      //   router.push({ pathname: `/aduan` }, `/aduan/`, { shallow: true });
    },
    [fileList]
  );

  return (
    <Space direction="vertical" style={{ display: "flex" }}>
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
              <Form.Item label="Detail Laporan" name="content">
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
