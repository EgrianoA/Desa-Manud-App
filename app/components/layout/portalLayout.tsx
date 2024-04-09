import React, { useCallback, useMemo } from "react";
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
  Grid,
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
const { useBreakpoint } = Grid;

interface Props {
  children: React.ReactNode;
}

const StyledMenu = styled(Menu)`
  span {
    font-size: 20px !important;
  }
`;

const StyledLogo = styled(Image)`
  &:hover {
    cursor: pointer;
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
      { label: "Informasi Keamanan", key: "/cctv" },
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
            {userContext.userFullName?.length > 10
              ? `${userContext.userFullName?.substring(0, 10)}...`
              : userContext.userFullName}
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
  const screens = useBreakpoint();

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

  const contactHeaderColSpan = {
    xs: 24,
    xl: 20,
    xxl: 13,
  };

  const navHeaderColSpan = {
    icon: { xs: 3, xxl: 2 },
    menu: { xs: 14, lg: 16, xl: 17, xxl: 18 },
    profile: { xs: 7, lg: 5, xl: 4 },
  };

  const headerPadding = useMemo(() => {
    if (screens.lg) {
      return { padding: "0 5vw 0 5vw" };
    }
    if (screens.xs || screens.sm) {
      return { padding: "0 20px 0 20px" };
    }
  }, [screens]);

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
          <Row style={{ ...headerPadding }}>
            <Col
              {...contactHeaderColSpan}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                height: 40,
                color: "white",
                fontSize: "18px",
                padding: "0 30px 0 15px",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: "16px",
                  marginRight: "20px",
                }}
              >
                <PhoneOutlined
                  style={{ color: "#FF3514", marginRight: "10px" }}
                />
                Hubungi kami: 0150 0090 2272
              </Text>
              <Text style={{ color: "white", fontSize: "16px" }}>
                <ClockCircleOutlined
                  style={{ color: "#FF3514", marginRight: "10px" }}
                />
                Waktu operasional: Senin - Jumat 8 pagi - 5 sore
              </Text>
            </Col>
          </Row>
          <Row
            style={{
              backgroundColor: "white",
              ...headerPadding,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              height: 100,
            }}
          >
            <Col
              {...navHeaderColSpan.icon}
              style={{ display: "flex", alignItems: "center" }}
            >
              <StyledLogo
                src="/Desa manud logo.png"
                width="80px"
                height="80px"
                alt="Desa manud logo"
                onClick={() => router.push("/")}
              />
            </Col>
            <Col {...navHeaderColSpan.menu}>
              <StyledMenu
                theme="light"
                mode="horizontal"
                items={menuItems}
                style={{ height: 100, display: "flex", alignItems: "center" }}
                onClick={({ key }) => redirectMenu(key)}
              />
            </Col>
            <Col {...navHeaderColSpan.profile}>
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
