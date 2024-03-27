import React, { useCallback, useMemo } from "react";
import {
  Layout,
  Menu,
  Image,
  Row,
  Col,
  Avatar,
  Dropdown,
  MenuProps,
  Typography,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  ContainerOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  initialUserContextData,
  useUserContext,
} from "../../utilities/authorization";

interface Props {
  children: React.ReactNode;
}

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const StyledMenu = styled(Menu)`
  &.ant-menu {
    padding-top: 40px;
    min-height: 100vh;
  }
`;

const DropdownContentContainer = styled(Row)`
  &.ant-dropdown-trigger:hover {
    cursor: pointer;
  }
`;

const menuItems = [
  { key: "/admin", icon: <HomeOutlined />, label: "Beranda" },
  { key: "/admin/users", icon: <UserOutlined />, label: "Daftar Pengguna" },
  {
    key: "/admin/articles",
    icon: <ContainerOutlined />,
    label: "Daftar Artikel",
  },
];

const dropdownItems = [
  {
    key: "logout",
    label: "Keluar",
    icon: <LogoutOutlined />,
  },
];

const AdminLayout = ({ children }: Props) => {
  const router = useRouter();
  const userContext = useUserContext();
  const currentPath = useMemo(() => router.pathname, [router.pathname]);

  const redirectToMenu = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const onDrawerClick: MenuProps["onClick"] = useCallback(
    ({ key }: { key: string }) => {
      if (key === "logout") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          userContext.setUserContext(initialUserContextData);
        }
        router.push("/admin/login");
      }
    },
    [router, userContext]
  );

  return (
    <Layout>
      <Header>
        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Dropdown menu={{ items: dropdownItems, onClick: onDrawerClick }}>
            <DropdownContentContainer>
              <Col style={{ marginRight: "20px" }}>
                <Text style={{ color: "white", fontSize: "20px" }}>
                  {userContext.userFullName}
                </Text>
              </Col>
              <Col>
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                />
              </Col>
            </DropdownContentContainer>
          </Dropdown>
        </Row>
      </Header>
      <Layout>
        <Sider width={200}>
          <Row
            style={{
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Image
              src="/Desa manud logo.png"
              width="150px"
              height="150px"
              alt="logo"
            />
          </Row>
          <StyledMenu
            mode="inline"
            selectedKeys={[currentPath]}
            items={menuItems}
            onClick={({ key }) => redirectToMenu(key)}
            className="sider-menu"
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: "64px 24px 24px 24px",
              margin: 0,
              minHeight: "100vh",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
