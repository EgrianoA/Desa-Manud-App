import {
  Row,
  Col,
  Card,
  Modal,
  Form,
  Input,
  Space,
  Button,
  Select,
  UploadFile,
  Upload,
} from "antd";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IReport, ReportType, StatusType } from "../../../api/reports";
import {
  useUserContext,
  getAuthorization,
} from "../../../utilities/authorization";
import getFileUrl from "../../../utilities/getFileUrl";

const reportType = (type: ReportType): string => {
  switch (type) {
    case ReportType.Keamanan:
      return "Keamanan";

    case ReportType.Kebersihan:
      return "Kebersihan";

    default:
      return "Lain-lain";
  }
};

const reportStatusOptions = [
  { label: "Laporan Baru", value: StatusType.New },
  { label: "Dalam Pengecekan", value: StatusType.OnCheck },
  { label: "Laporan Dibatalkan", value: StatusType.Cancelled },
  { label: "Laporan Ditolak", value: StatusType.Rejected },
  { label: "Laporan Selesai Diproses", value: StatusType.Done },
];

const ReportModal = ({
  closeModalAction,
  visible,
  reportData,
}: {
  closeModalAction: (action: boolean) => void;
  visible: boolean;
  reportData: IReport;
}) => {
  const { TextArea } = Input;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const userContext = useUserContext();
  const router = useRouter();

  const closeModal = useCallback(() => {
    closeModalAction(true);
  }, [closeModalAction]);

  useEffect(() => {
    if (reportData.attachment.length) {
      const initialFileList = reportData.attachment.map((image) => {
        return {
          uid: image._id,
          name: image.filename,
          url: getFileUrl(image),
        };
      });
      setFileList(initialFileList);
    } else {
      setFileList([]);
    }
  }, [reportData.attachment]);

  const onFinish = useCallback(
    async (values: any) => {
      if (reportData._id) {
        const response: AxiosResponse<T> = await axios({
          method: "patch",
          url: process.env.BE_BASEURL + "/api/reports",
          data: { id: reportData._id, ...values },
          ...getAuthorization(userContext?.token || ""),
        }).catch((e) => {
          return e.response;
        });

        if (response?.status === 200) {
          router.reload();
        }
      }
    },
    [reportData._id, userContext?.token, router]
  );

  const reportTypeValue = useMemo(
    () => reportType(reportData.type),
    [reportData.type]
  );

  return (
    <Modal
      footer={null}
      onCancel={closeModal}
      open={visible}
      width={"70vw"}
      destroyOnClose
    >
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
              initialValues={reportData || undefined}
              onFinish={onFinish}
            >
              <Card title="Detail Laporan" extra={null}>
                <Form.Item label="No Laporan" name="reportNo">
                  <Input placeholder="" disabled />
                </Form.Item>
                <Form.Item label="Tipe Laporan">
                  <Input placeholder="" disabled value={reportTypeValue} />
                </Form.Item>
                <Form.Item label="Keterangan" name="description">
                  <TextArea placeholder="" disabled rows={10} />
                </Form.Item>
                <Form.Item label="Lampiran" name="attachment">
                  <Upload
                    accept=".jpg,.jpeg,.png,.mp4"
                    listType="picture-card"
                    fileList={fileList}
                    disabled
                  />
                </Form.Item>
                <Form.Item label="Status Laporan" name="status">
                  <Select options={reportStatusOptions} />
                </Form.Item>
                <Form.Item label="Catatan Tindakan" name="notes">
                  <TextArea placeholder="" rows={10} />
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
    </Modal>
  );
};
const useReportModal = () => {
  const [visible, setVisible] = useState(false);
  const [reportData, setreportData] = useState<IReport>();

  const actions = useMemo(() => {
    const close = () => setVisible(false);

    return {
      open: (reportData: IReport) => {
        setreportData(reportData);
        setVisible(true);
      },
      close,
    };
  }, [setVisible]);

  return {
    ...actions,
    render: () =>
      reportData && (
        <ReportModal
          reportData={reportData}
          closeModalAction={actions.close}
          visible={visible}
        />
      ),
  };
};

export default useReportModal;
