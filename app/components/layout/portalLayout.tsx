import React, { useCallback } from "react";
import {
  Layout,
  Row,
  Col,
  Menu,
  Dropdown,
  Typography,
  MenuProps,
  Avatar,
  Button,
} from "antd";
import styled from "styled-components";
import Image from "next/image";
import {
  PhoneOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  UserOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { DropdownContentContainer } from "./adminLayout";
import {
  IUserContextData,
  initialUserContextData,
  useUserContext,
} from "../../utilities/authorization";

const { Header, Footer, Content } = Layout;

const { Text } = Typography;

interface Props {
  children: React.ReactNode;
}

const StyledMenu = styled(Menu)`
  span {
    font-size: 20px !important;
  }
`;

const menuItems = [
  {
    label: "Beranda",
    key: "/",
  },
  {
    label: "Layanan",
    key: "service",
    children: [
      { label: "Pelayanan Aduan Desa", key: "/aduan" },
      { label: "Permintaan Dokumen", key: "/permintaan-dokumen" },
    ],
  },
  {
    label: "Informasi",
    key: "artikel",
    children: [
      { label: "Pencapaian Program Kerja", key: "/pencapaian-program-kerja" },
      { label: "Informasi & Berita Desa", key: "/artikel" },
      { label: "Informasi Program Kesehatan", key: "/program-kesehatan" },
      { label: "Informasi Program Kebersihan", key: "/program-kebersihan" },
      { label: "Informasi Kemitraan", key: "/informasi-kemitraan" },
      { label: "Informasi Keamanan", key: "/informasi-keamanan" },
    ],
  },
];

const dropdownItems = [
  {
    key: "logout",
    label: "Keluar",
    icon: <LogoutOutlined />,
  },
];

const UserColumn = ({
  userContext,
  onDrawerClick,
  onLoginClick,
}: {
  userContext: IUserContextData | null;
  onDrawerClick: MenuProps["onClick"];
  onLoginClick: () => void;
}) => {
  if (!userContext?.token) {
    return (
      <Button
        style={{
          marginRight: "20px",
          height: "40px",
        }}
        onClick={onLoginClick}
      >
        <Text style={{ color: "black", fontSize: "20px" }}>
          <LoginOutlined style={{ marginRight: "10px" }} />
          Masuk
        </Text>
      </Button>
    );
  }

  return (
    <Dropdown menu={{ items: dropdownItems, onClick: onDrawerClick }}>
      <DropdownContentContainer>
        <Col style={{ marginRight: "20px" }}>
          <Text style={{ color: "black", fontSize: "20px" }}>
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
  );
};

const PortalLayout = ({ children }: Props) => {
  const router = useRouter();
  const userContext = useUserContext();

  const redirectMenu = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const onLoginClick = useCallback(() => {
    router.push("/login");
  }, [router]);

  const onDrawerClick: MenuProps["onClick"] = useCallback(
    ({ key }: { key: string }) => {
      if (key === "logout") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          userContext.setUserContext(initialUserContextData);
        }
        router.replace("/");
      }
    },
    [router, userContext]
  );

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100vw",
          display: "flex",
          alignItems: "center",
          height: "auto",
          padding: 0,
          backgroundColor: "white",
        }}
      >
        <Col span={24} style={{ backgroundColor: "#06163A" }}>
          <Row style={{ paddingLeft: "15vw", paddingRight: "15vw" }}>
            <Col
              span={13}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 40,
                color: "white",
                fontSize: "18px",
                padding: "0 30px 0 15px",
              }}
            >
              <span>
                <PhoneOutlined style={{ color: "#FF3514" }} /> Hubungi kami:
                0820 0090 2272{" "}
              </span>
              <span>
                <ClockCircleOutlined style={{ color: "#FF3514" }} /> Waktu
                operasional: Senin - Jumat 8 pagi - 5 sore{" "}
              </span>
            </Col>
          </Row>
          <Row
            style={{
              backgroundColor: "white",
              paddingLeft: "15vw",
              paddingRight: "15vw",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: 100,
            }}
          >
            <Col span={2} style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/Desa manud logo.png"
                width="80px"
                height="80px"
                alt="Desa manud logo"
              />
            </Col>
            <Col span={18}>
              <StyledMenu
                theme="light"
                mode="horizontal"
                items={menuItems}
                style={{ height: 100, display: "flex", alignItems: "center" }}
                onClick={({ key }) => redirectMenu(key)}
              />
            </Col>
            <Col span={4}>
              <UserColumn
                userContext={userContext}
                onDrawerClick={onDrawerClick}
                onLoginClick={onLoginClick}
              />
            </Col>
          </Row>
        </Col>
      </Header>
      <Content style={{ minHeight: "90vh" }}>{children}</Content>
      <Footer
        style={{
          textAlign: "center",
          backgroundColor: "#06163A",
          color: "white",
          fontSize: "24px",
        }}
      >
        <Row>
          <Col span={6}>Alamat</Col>
          <Col span={6}>Media Sosial</Col>
          <Col span={6}></Col>
          <Col span={6}></Col>
        </Row>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          Desa Manud Jaya ©{new Date().getFullYear()}
        </Row>
      </Footer>
    </Layout>
  );
};

export default PortalLayout;
