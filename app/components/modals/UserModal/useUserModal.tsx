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
import { useCallback, useMemo, useState } from "react";
import { IUser, userRoleNaming, UserRole } from "../../../api/users";

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
  const closeModal = useCallback(() => {
    closeModalAction(true);
  }, [closeModalAction]);

  const onFinish = useCallback(
    (values: any) => {
      //if no user data -> create new. Else update
      console.log({ _id: userData._id, ...values });
    },
    [userData?._id]
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
                <Form.Item label="Username" name="username">
                  <Input placeholder="" />
                </Form.Item>
                <Form.Item label="Nama Lengkap" name="userFullName">
                  <Input placeholder="" />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input placeholder="" />
                </Form.Item>
                {availableUserRole.length && (
                  <Form.Item label="Role" name="role">
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
