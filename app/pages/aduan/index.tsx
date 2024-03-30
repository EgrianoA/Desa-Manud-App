import type { NextPage } from "next";
import { uniqBy } from "lodash";
import { Card, Col, Row, Image, Tabs, Typography } from "antd";
import type { TabsProps } from "antd";
import { Text } from "@nextui-org/react";
import { useMemo, useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { useFetchArticles } from "../../api/articles";
import InfiniteScroll from "react-infinite-scroll-component";
import { useUserContext } from "../../utilities/authorization";
import { useRouter } from "next/router";
import NewReport from "../../components/portalPage/Report/NewReport";
import CheckReport from "../../components/portalPage/Report/CheckReport";

const PageContainer = styled.div`
  margin: 40px 30vw;
`;

const { Title } = Typography;

const tabs: TabsProps["items"] = [
  {
    key: "status",
    label: "Cek Status Laporan",
    children: <CheckReport />,
  },
  {
    key: "new",
    label: "Buat Laporan Baru",
    children: <NewReport />,
  },
];

const Report: NextPage = () => {
  const router = useRouter();
  const userContext = useUserContext();

  return (
    <PageContainer>
      <Title level={3}>
        Selamat datang {userContext.userFullName}, di Layanan Aduan Desa Manud
        Jaya
      </Title>
      <Tabs items={tabs} />
    </PageContainer>
  );
};
export default Report;
