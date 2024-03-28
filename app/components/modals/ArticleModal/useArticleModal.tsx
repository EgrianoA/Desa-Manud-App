import {
  Row,
  Col,
  Card,
  Modal,
  Form,
  Input,
  Space,
  Button,
  UploadFile,
  UploadProps,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IArticle } from "../../../api/articles";
import {
  useUserContext,
  getAuthorization,
} from "../../../utilities/authorization";
import getFileUrl from "../../../utilities/getFileUrl";
import sendFileToServer from "../../../api/sendFileToServer";

const uploadHeaderImage = async (
  fileList: UploadFile[],
  articleId: string,
  token: string
) => {
  const form = new FormData();
  await Promise.all(
    fileList.map(async (file) => {
      if (file.url) {
        const fileBlob = await axios.get(file.url, { responseType: "blob" });
        form.append(
          "headerImages",
          new File([fileBlob.data], file.name) as Blob
        );
      } else if (file.originFileObj) {
        form.append("headerImages", file.originFileObj as Blob);
      }
    })
  );

  sendFileToServer(form, `/api/articles/uploadHeaderImage/${articleId}`, token);
};

const ArticleModal = ({
  closeModalAction,
  visible,
  articleData,
}: {
  closeModalAction: (action: boolean) => void;
  visible: boolean;
  articleData?: IArticle | null;
}) => {
  const { TextArea } = Input;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const userContext = useUserContext();
  const router = useRouter();

  const closeModal = useCallback(() => {
    closeModalAction(true);
  }, [closeModalAction]);

  useEffect(() => {
    if (articleData?.headerImage.length) {
      const initialFileList = articleData.headerImage.map((image) => {
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
  }, [articleData?.headerImage]);

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const onFinish = useCallback(
    async (values: any) => {
      //if no article data -> create new. Else update
      const { headerImage, ...contentData } = values;
      if (!articleData?._id) {
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
          data: { id: articleData._id, ...contentData },
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
    [articleData?._id, fileList, router, userContext?.token]
  );

  const onDelete = useCallback((id: string) => {
    console.log(id);
  }, []);

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
              initialValues={articleData || undefined}
              onFinish={onFinish}
            >
              <Card
                title="Detail Pengguna"
                extra={
                  articleData?._id && (
                    <Button
                      type="primary"
                      danger
                      onClick={() => onDelete(articleData?._id)}
                    >
                      Hapus
                    </Button>
                  )
                }
              >
                <Form.Item label="Judul Artikel" name="title">
                  <Input placeholder="" />
                </Form.Item>
                <Form.Item label="Isi Artikel" name="content">
                  <TextArea placeholder="" rows={10} />
                </Form.Item>
                <Form.Item label="Gambar Artikel" name="headerImage">
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
    </Modal>
  );
};
const useArticleModal = () => {
  const [visible, setVisible] = useState(false);
  const [articleData, setArticleData] = useState<IArticle | null>(null);

  const actions = useMemo(() => {
    const close = () => setVisible(false);

    return {
      open: (articleData: IArticle | null) => {
        setArticleData(articleData);
        setVisible(true);
      },
      close,
    };
  }, [setVisible]);

  return {
    ...actions,
    render: () => (
      <ArticleModal
        articleData={articleData}
        closeModalAction={actions.close}
        visible={visible}
      />
    ),
  };
};

export default useArticleModal;
