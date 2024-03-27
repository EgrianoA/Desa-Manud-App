import React, { useCallback } from "react";
import { Layout, Row, Col, Menu } from "antd";
import styled from "styled-components";
import Image from "next/image";
import { PhoneOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const { Header, Footer, Sider, Content } = Layout;

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
  },
  {
    label: "Informasi",
    key: "/artikel",
  },
];

const PortalLayout = ({ children }: Props) => {
  const router = useRouter();
  const redirectMenu = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
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
            <Col span={22}>
              <StyledMenu
                theme="light"
                mode="horizontal"
                items={menuItems}
                style={{ height: 100, display: "flex", alignItems: "center" }}
                onClick={({ key }) => redirectMenu(key)}
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
          <Col span={6}>Social Media</Col>
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
