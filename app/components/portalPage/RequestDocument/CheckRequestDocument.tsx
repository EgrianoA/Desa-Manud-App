import { Row, Col, Card, Form, Input, Space, Button, Alert } from "antd";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAuthorization,
  useUserContext,
} from "../../../utilities/authorization";
import { StatusType } from "../../../api/reports";

type ReportStatusResultType = {
  status: string | undefined;
  message: string | undefined;
  description: string | undefined;
};

const initialStatus: ReportStatusResultType = {
  status: undefined,
  message: undefined,
  description: undefined,
};

const generateReportDescription = (type?: StatusType, notes?: string) => {
  switch (type) {
    case StatusType.New:
    case StatusType.OnCheck:
      return `Permintaan dokumen anda saat ini masih dalam proses${
        notes ? `\n\nKeterangan: ${notes}` : ""
      }`;

    case StatusType.Cancelled:
    case StatusType.Rejected:
      return `Mohon maaf, permintaan dokumen anda tidak dapat kami proses lebih lanjut${
        notes ? `\n\nKeterangan: ${notes}` : ""
      }`;

    case StatusType.Done:
      return `Permintaan dokumen anda telah selesai diproses, silahkan untuk diambil di kantor keluarahan${
        notes ? `\n\nKeterangan: ${notes}` : ""
      }`;

    default:
      return "Tidak ada permintaan dokumen dengan nomor tersebut";
  }
};

const generateReportStatus = (type?: StatusType) => {
  switch (type) {
    case StatusType.New:
    case StatusType.OnCheck:
      return "found";

    case StatusType.Cancelled:
    case StatusType.Rejected:
      return "cancelled";

    case StatusType.Done:
      return "done";

    default:
      return "not-found";
  }
};

const AlertResponse = ({
  status,
  message,
  description,
}: {
  status: string | undefined;
  message: string | undefined;
  description: string | undefined;
}) => {
  let type: "info" | "warning" | "success" | "error" | undefined;
  switch (status) {
    case "found":
      type = "info";
      break;

    case "cancelled":
      type = "warning";
      break;

    case "done":
      type = "success";
      break;

    default:
      type = "error";
      break;
  }

  return (
    <Alert message={message} description={description} type={type} showIcon />
  );
};

const CheckRequestDocument = ({ currentTab }: { currentTab: string }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const userContext = useUserContext();
  const [reportStatus, setReportStatus] = useState(initialStatus);

  const onFinish = useCallback(
    async (values: any) => {
      const response: AxiosResponse<T> = await axios({
        method: "post",
        url: process.env.BE_BASEURL + "/api/reports/byNumber",
        data: { reportNo: values.reportNumber },
        ...getAuthorization(userContext?.token || ""),
      }).catch((e) => {
        return e.response;
      });

      if (response?.status === 200 && response?.data?.data) {
        const { status, notes } = response.data.data;
        setReportStatus({
          status: generateReportStatus(status),
          message: `${values.reportNumber}`,
          description: generateReportDescription(status, notes),
        });
      } else {
        setReportStatus({
          status: generateReportStatus(),
          message: `${values.reportNumber}`,
          description: generateReportDescription(),
        });
      }
    },
    [userContext?.token]
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
            <Card title="Silahkan masukkan nomor permintaan dokumen anda" extra={null}>
              <Form.Item label="Nomor Permintaan Dokumen" name="reportNumber">
                <Input placeholder="" />
              </Form.Item>
              <center>
                <Button type="primary" htmlType="submit">
                  Cek Status
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
                {reportStatus.status && (
                  <AlertResponse
                    status={reportStatus.status}
                    description={reportStatus.description}
                    message={reportStatus.message}
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

export default CheckRequestDocument;
