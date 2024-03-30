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

const PageContainer = styled.div`
  margin: 40px 30vw;
`;

const { Title } = Typography;

const tabs: TabsProps["items"] = [
  {
    key: "status",
    label: "Cek Status Permintaan Dokumen",
    children: "Content of Tab Pane 1",
  },
  {
    key: "new",
    label: "Buat Permintaan Dokumen Baru",
    children: "Content of Tab Pane 2",
  },
];

const RequestDocument: NextPage = () => {
  const router = useRouter();
  const userContext = useUserContext();

  if (!userContext?.token) {
    router.replace("/login");
  }

  return (
    <PageContainer>
      <Title level={3}>
        Selamat datang {userContext.userFullName}, di Layanan Permintaan Dokumen
        Desa Manud Jaya
      </Title>
      <Tabs
        items={tabs}
        onChange={(key: string) =>
          router.push(
            { pathname: `/permintaan-dokumen` },
            `/permintaan-dokumen/${key === "status" ? "" : key}`,
            { shallow: true }
          )
        }
      />
    </PageContainer>
  );
};
export default RequestDocument;
