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
} from "antd";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { IArticle } from "../../../api/articles";
import {
  useUserContext,
  getAuthorization,
} from "../../../utilities/authorization";
import { UserRole } from "../../../api/users";

const ArticleModal = ({
  closeModalAction,
  visible,
  articleData,
}: {
  closeModalAction: (action: boolean) => void;
  visible: boolean;
  articleData?: IArticle | null;
}) => {
  const closeModal = useCallback(() => {
    closeModalAction(true);
  }, [closeModalAction]);

  const { TextArea } = Input;
  const userContext = useUserContext();
  const router = useRouter();

  const onFinish = useCallback(
    async (values: any) => {
      //if no article data -> create new. Else update
      if (!articleData?._id) {
        const response: AxiosResponse<T> = await axios({
          method: "post",
          url: process.env.BE_BASEURL + "/api/articles",
          data: values,
          ...getAuthorization(userContext?.token || ""),
        });

        if (response?.status === 200) {
          closeModal();
        }
      } else {
        const response: AxiosResponse<T> = await axios({
          method: "patch",
          url: process.env.BE_BASEURL + "/api/articles",
          data: { id: articleData._id, ...values },
          ...getAuthorization(userContext?.token || ""),
        });

        if (response?.status === 200) {
          closeModal();
        }
      }
    },
    [articleData?._id, closeModal, userContext?.token]
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
                  <TextArea placeholder="" />
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
  const [loggedUserRole, setLoggedUserRole] = useState<UserRole | null>(null);

  const actions = useMemo(() => {
    const close = () => setVisible(false);

    return {
      open: (articleData: IArticle | null, role: UserRole | null) => {
        setArticleData(articleData);
        setVisible(true);
        setLoggedUserRole(role);
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
