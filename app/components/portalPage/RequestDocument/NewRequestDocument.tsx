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
  Alert,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios, { AxiosResponse } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import type { UploadFile, UploadProps } from "antd";
import sendFileToServer from "../../../api/sendFileToServer";
import {
  getAuthorization,
  useUserContext,
} from "../../../utilities/authorization";
import { TuiDatePicker } from 'nextjs-tui-date-picker';

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
    `/api/reports/uploadReportAttachment/${reportId}`,
    token
  );
};

const NewRequestDocument = ({ currentTab }: { currentTab: string }) => {
  const { TextArea } = Input;
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [reportNo, setReportNo] = useState<string>();
  const userContext = useUserContext();
  const [form] = Form.useForm();

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
        setReportSubmitted(true);
        setReportNo(response.data.reportNo);
      }
    },
    [fileList, messageApi, userContext?.token]
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
              title="Silahkan sampaikan permintaan dokumen anda di form berikut"
              extra={null}
            >
              <Form.Item label="Jenis Dokumen" name="tipe_dokumen">
                <Select
                  options={[
                    { value: "keterangan-domisili", label: "Surat Keterangan Domisili" },
                    { value: "pengantar-nikah", label: "Surat Pengantar Nikah" },
                    { value: "keterangan-tidak-mampu", label: "Surat Keterangan Tidak Mampu" },
                    { value: "surat-izin-usaha", label: "Surat Izin Usaha" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Nama Lengkap" name="nama_lengkap">
                <Input placeholder="Nama lengkap " />
              </Form.Item>
              <Form.Item label="Tempat Lahir" name="tempat_lahir">
                <Input placeholder="Tempat lahir " />
              </Form.Item>
              <Form.Item label="Tanggal Lahir" name="tanggal_lahir">
                <TuiDatePicker
                    handleChange={() => console.log('Hello world!')}
                    inputWidth={140}
                    fontSize={16}
                />
              </Form.Item>
              <Form.Item label="Pekerjaan" name="pekerjaan">
                <Input placeholder="Pekerjaan " />
              </Form.Item>
              <Form.Item label="Jenis Kelamin" name="jenis_kelamin">
                <Select
                  options={[
                    { value: "pria", label: "Pria" },
                    { value: "wanita", label: "Wanita" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Alamat" name="alamat">
                <TextArea placeholder="Alamat" />
              </Form.Item>
              <center>
                <Button type="primary" htmlType="submit">
                  Simpan
                </Button>
              </center>
              <Row
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "30px",
                  width: "100%",
                }}
              >
                {reportSubmitted && reportNo && (
                  <Alert
                    message="Terima kasih, laporan Anda telah kami terima."
                    description={
                      <p>
                        Silahkan simpan nomor laporan berikut untuk mengecek
                        status laporan Anda: <br />
                        <strong>{reportNo}</strong>
                      </p>
                    }
                    type="info"
                    showIcon
                  />
                )}
              </Row>
            </Card>
          </Form>
        </Col>
      </Row>
    </Space>
  );
};

export default NewRequestDocument;
