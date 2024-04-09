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
  UploadFile,
  UploadProps,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArticleKind, IArticle } from "../../../api/articles";
import {
  useUserContext,
  getAuthorization,
} from "../../../utilities/authorization";
import getFileUrl from "../../../utilities/getFileUrl";
import { uploadHeaderImage } from "../ArticleModal/useArticleModal";

const programKindOptions = [
  { label: "Kebersihan", value: ArticleKind.Kebersihan },
  { label: "Kesehatan", value: ArticleKind.Kesehatan },
];

const ProgramModal = ({
  closeModalAction,
  visible,
  programData,
}: {
  closeModalAction: (action: boolean) => void;
  visible: boolean;
  programData?: IArticle | null;
}) => {
  const { TextArea } = Input;
  const userContext = useUserContext();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const router = useRouter();

  const closeModal = useCallback(() => {
    closeModalAction(true);
  }, [closeModalAction]);

  useEffect(() => {
    if (programData?.headerImage.length) {
      const initialFileList = programData.headerImage.map((image) => {
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
  }, [programData?.headerImage]);

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const onFinish = useCallback(
    async (values: any) => {
      //if no article data -> create new. Else update
      const { headerImage, ...contentData } = values;

      if (!programData?._id) {
        const response: AxiosResponse<T> = await axios({
          method: "post",
          url: process.env.BE_BASEURL + "/api/articles",
          data: contentData,
          ...getAuthorization(userContext?.token || ""),
        }).catch((e) => {
          return e.response;
        });

        if (response?.status === 200) {
          uploadHeaderImage(
            fileList,
            response.data._id,
            userContext?.token || ""
          );
          router.reload();
        }
      } else {
        const response: AxiosResponse<T> = await axios({
          method: "patch",
          url: process.env.BE_BASEURL + "/api/articles",
          data: { id: programData._id, ...contentData },
          ...getAuthorization(userContext?.token || ""),
        }).catch((e) => {
          return e.response;
        });

        if (response?.status === 200) {
          uploadHeaderImage(
            fileList,
            response.data._id,
            userContext?.token || ""
          );
          router.reload();
        }
      }
    },
    [programData?._id, userContext?.token, fileList, router]
  );

  const onDelete = useCallback(
    async (id: string) => {
      const response: AxiosResponse<T> = await axios({
        method: "delete",
        url: process.env.BE_BASEURL + "/api/articles",
        data: { id },
        ...getAuthorization(userContext?.token || ""),
      }).catch((e) => {
        return e.response;
      });
      if (response?.status === 200) {
        router.reload();
      }
    },
    [router, userContext?.token]
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
              initialValues={programData || undefined}
              onFinish={onFinish}
            >
              <Card
                title="Detail Program"
                extra={
                  programData?._id && (
                    <Button
                      type="primary"
                      danger
                      onClick={() => onDelete(programData?._id)}
                    >
                      Hapus
                    </Button>
                  )
                }
              >
                <Form.Item label="Judul Program" name="title">
                  <Input placeholder="" />
                </Form.Item>
                <Form.Item label="Tipe Program" name="type">
                  <Select options={programKindOptions} />
                </Form.Item>
                <Form.Item label="Keterangan" name="content">
                  <TextArea placeholder="" rows={10} />
                </Form.Item>
                <Form.Item label="Gambar Artikel" name="headerImage">
                  <Upload
                    accept=".jpg,.jpeg,.png,.mp4"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                  >
                    {fileList.length >= 2 ? null : (
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
    </Modal>
  );
};
const useProgramModal = () => {
  const [visible, setVisible] = useState(false);
  const [programData, setProgramData] = useState<IArticle | null>();

  const actions = useMemo(() => {
    const close = () => setVisible(false);

    return {
      open: (programData: IArticle | null) => {
        setProgramData(programData);
        setVisible(true);
      },
      close,
    };
  }, [setVisible]);

  return {
    ...actions,
    render: () => (
      <ProgramModal
        programData={programData}
        closeModalAction={actions.close}
        visible={visible}
      />
    ),
  };
};

export default useProgramModal;
