import {
  Row,
  Col,
  Card,
  Modal,
  ModalProps,
  Form,
  Input,
  Space,
  Button,
  Select,
  Alert,
} from "antd";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

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

const CheckReport = () => {
  const router = useRouter();
  const [reportStatus, setReportStatus] = useState(initialStatus);

  const onFinish = useCallback(async (values: any) => {
    if (values.reportNumber === "AD-300324-0001") {
      setReportStatus({
        status: "found",
        message: `Laporan ${values.reportNumber}`,
        description: "Laporan anda saat ini sedang dalam proses pengecekan",
      });
    } else {
      setReportStatus({
        status: "not-found",
        message: `Laporan ${values.reportNumber}`,
        description: "Tidak ada laporan dengan nomor aduan tersebut",
      });
    }
  }, []);

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
            <Card title="Silahkan masukkan nomor aduan anda" extra={null}>
              <Form.Item label="Nomor Aduan" name="reportNumber">
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
                {reportStatus.status === "found" && (
                  <Alert
                    message={reportStatus.message}
                    description={reportStatus.description}
                    type="info"
                    showIcon
                  />
                )}
                {reportStatus.status === "not-found" && (
                  <Alert
                    message={reportStatus.message}
                    description={reportStatus.description}
                    type="error"
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

export default CheckReport;
