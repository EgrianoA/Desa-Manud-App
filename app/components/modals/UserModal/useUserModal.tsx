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
} from "antd";
import { useCallback, useMemo, useState } from "react";
import { IUser, userRoleNaming, UserRole } from "../../../api/users";
import {
  getAuthorization,
  useUserContext,
} from "../../../utilities/authorization";
import { useRouter } from "next/router";
import axios, { AxiosResponse } from "axios";

const UserModal = ({
  closeModalAction,
  visible,
  userData,
  loggedUserRole,
}: {
  closeModalAction: (action: boolean) => void;
  visible: boolean;
  userData?: IUser | null;
  loggedUserRole?: string | null;
}) => {
  const userContext = useUserContext();
  const router = useRouter();

  const closeModal = useCallback(() => {
    closeModalAction(true);
  }, [closeModalAction]);

  const onFinish = useCallback(
    async (values: any) => {
      //if no article data -> create new. Else update
      if (!userData?._id) {
        const response: AxiosResponse<T> = await axios({
          method: "post",
          url: process.env.BE_BASEURL + "/api/users/register",
          data: values,
          ...getAuthorization(userContext?.token || ""),
        }).catch((e) => {
          return e.response;
        });

        if (response?.status === 201) {
          router.reload();
        }
      } else {
        const response: AxiosResponse<T> = await axios({
          method: "patch",
          url: process.env.BE_BASEURL + "/api/users",
          data: { id: userData._id, ...values },
          ...getAuthorization(userContext?.token || ""),
        }).catch((e) => {
          return e.response;
        });

        if (response?.status === 200) {
          router.reload();
        }
      }
    },
    [router, userContext?.token, userData?._id]
  );

  const onDelete = useCallback((id: string) => {
    console.log(id);
  }, []);

  const availableUserRole = useMemo(() => {
    const userRole: { label: string; value: string }[] = [];

    Object.keys(userRoleNaming).forEach((key) => {
      userRole.push({ label: userRoleNaming[key], value: key });
    });

    if (loggedUserRole !== UserRole.SuperAdmin) {
      return userRole.filter((role) => role.value !== UserRole.SuperAdmin);
    }

    return userRole;
  }, [loggedUserRole]);

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
              initialValues={userData || undefined}
              onFinish={onFinish}
            >
              <Card
                title="Detail Pengguna"
                extra={
                  userData?._id && (
                    <Button
                      type="primary"
                      danger
                      onClick={() => onDelete(userData?._id)}
                    >
                      Hapus
                    </Button>
                  )
                }
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Silahkan masukkan Username",
                    },
                  ]}
                >
                  <Input placeholder="" />
                </Form.Item>
                <Form.Item
                  label="Nama Lengkap"
                  name="userFullName"
                  rules={[
                    {
                      required: true,
                      message: "Silahkan masukkan Nama Lengkap",
                    },
                  ]}
                >
                  <Input
                    placeholder=""
                    onKeyPress={(event) => {
                      if (!/[a-zA-z ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                {!userData && (
                  <Form.Item
                    name="userNIK"
                    rules={[
                      {
                        type: "string",
                        min: 16,
                        max: 16,
                        message: "Silahkan masukkan NIK dengan sesuai",
                      },
                      {
                        required: true,
                        message: "Silahkan masukkan NIK",
                      },
                    ]}
                    label="NIK Pengguna"
                  >
                    <Input
                      placeholder=""
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                )}
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Silahkan masukkan Email",
                    },
                  ]}
                >
                  <Input placeholder="" />
                </Form.Item>
                {!userData && (
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Silahkan masukkan password",
                      },
                    ]}
                  >
                    <Input.Password type="password" placeholder="" />
                  </Form.Item>
                )}
                {availableUserRole.length && (
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Silahkan masukkan Role",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: 180 }}
                      options={availableUserRole}
                    />
                  </Form.Item>
                )}
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
const useUserModal = () => {
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loggedUserRole, setLoggedUserRole] = useState<UserRole | null>(null);
  const actions = useMemo(() => {
    const close = () => {
      setVisible(false);
      setLoggedUserRole(null);
    };

    return {
      open: (userData: IUser, role: UserRole | null) => {
        setUserData(userData);
        setVisible(true);
        setLoggedUserRole(role);
      },
      close,
    };
  }, [setVisible]);

  return {
    ...actions,
    render: () => (
      <UserModal
        userData={userData}
        closeModalAction={actions.close}
        visible={visible}
        loggedUserRole={loggedUserRole}
      />
    ),
  };
};

export default useUserModal;
