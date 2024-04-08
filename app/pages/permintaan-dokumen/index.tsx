import type { NextPage } from "next";
import { Tabs, Typography } from "antd";
import type { TabsProps } from "antd";
import styled from "styled-components";
import { useUserContext } from "../../utilities/authorization";
import { useRouter } from "next/router";
import NewRequestDocument from "../../components/portalPage/RequestDocument/NewRequestDocument";
import CheckRequestDocument from "../../components/portalPage/RequestDocument/CheckRequestDocument";
import { useState } from "react";

const PageContainer = styled.div`
  margin: 40px 30vw;
`;

const { Title } = Typography;

const RequestDocument: NextPage = () => {
  const router = useRouter();
  const userContext = useUserContext();
  const [currentTab, setCurrentTab] = useState<string>("status");

  const tabs: TabsProps["items"] = [
    {
      key: "status",
      label: "Cek Status Permintaan Dokumen",
      children: <CheckRequestDocument currentTab={currentTab} />,
    },
    {
      key: "new",
      label: "Buat Permintaan Dokumen Baru",
      children: <NewRequestDocument currentTab={currentTab} />,
    },
  ];

  return (
    <PageContainer>
      <Title level={3}>
        Selamat datang {userContext.userFullName}, di Layanan Permintaan Dokumen Manud
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
export default RequestDocument;
