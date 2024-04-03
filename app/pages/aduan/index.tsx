import type { NextPage } from "next";
import { Tabs, Typography } from "antd";
import type { TabsProps } from "antd";
import styled from "styled-components";
import { useUserContext } from "../../utilities/authorization";
import { useRouter } from "next/router";
import NewReport from "../../components/portalPage/Report/NewReport";
import CheckReport from "../../components/portalPage/Report/CheckReport";
import { useState } from "react";

const PageContainer = styled.div`
  margin: 40px 30vw;
`;

const { Title } = Typography;

const Report: NextPage = () => {
  const router = useRouter();
  const userContext = useUserContext();
  const [currentTab, setCurrentTab] = useState<string>("status");

  const tabs: TabsProps["items"] = [
    {
      key: "status",
      label: "Cek Status Laporan",
      children: <CheckReport currentTab={currentTab} />,
    },
    {
      key: "new",
      label: "Buat Laporan Baru",
      children: <NewReport currentTab={currentTab} />,
    },
  ];

  return (
    <PageContainer>
      <Title level={3}>
        Selamat datang {userContext.userFullName}, di Layanan Aduan Desa Manud
        Jaya
      </Title>
      <Tabs
        items={tabs}
        activeKey={currentTab}
        onChange={(value) => {
          setCurrentTab(value);
        }}
      />
    </PageContainer>
  );
};
export default Report;
