import { Col, Row, Table, Typography, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusCircleOutlined } from "@ant-design/icons";
import type { NextPage } from "next";
import React, { useMemo, useState, useCallback } from "react";
import useArticleModal from "./modals/ArticleModal/useArticleModal";
import { ArticleKind, IArticle, useFetchArticles } from "../api/articles";
import dayjs from "dayjs";

type ArticleDataType = IArticle & {
  key: string;
};

const { Title } = Typography;

const columns: ColumnsType<ArticleDataType> = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Nama Penulis",
    dataIndex: "creator",
    key: "creator",
    render: (creator) => <>{creator.userFullName}</>,
  },
  {
    title: "Dibuat Pada",
    key: "createdAt",
    dataIndex: "createdAt",
    render: (_, { createdAt }) => (
      <>{dayjs(createdAt).format("DD/MM/YYYY HH:mm")}</>
    ),
  },
];

type SharedArticlePageProps = {
  articleKind: ArticleKind;
};

const SharedArticlePage = ({ articleKind }: SharedArticlePageProps) => {
  const articleModal = useArticleModal(articleKind);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(10);
  const {
    data: dataSource,
    loading,
    error,
  } = useFetchArticles({
    page,
    pageSize: size,
    query: { types: [articleKind] },
  });

  const articleData = useMemo(() => {
    if (dataSource) {
      setTotal(dataSource.count);
      return dataSource.data || [];
    }

    return [];
  }, [dataSource]);

  const onPaginationTableChange = useCallback(
    (page: number, pageSize: number) => {
      setPage(page);
      setSize(pageSize);
    },
    []
  );

  const pageCopywriting = useMemo(() => {
    switch (articleKind) {
      case ArticleKind.Kemitraan:
        return {
          title: "Informasi Kemitraan",
          buttonText: "Buat Informasi Kemitraan",
        };

      case ArticleKind.ProgramKerja:
        return {
          title: "Informasi Program Kerja",
          buttonText: "Buat Informasi Program Kerja",
        };

      default:
        return {
          title: "Informasi & Berita Desa",
          buttonText: "Buat Informasi Baru",
        };
    }
  }, [articleKind]);

  return (
    <>
      <Title level={3}>{pageCopywriting.title}</Title>
      <Row style={{ display: "flex", justifyContent: "end" }}>
        <Col>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              articleModal.open(null);
            }}
            type="primary"
          >
            {pageCopywriting.buttonText}
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={articleData}
        style={{ marginTop: "20px" }}
        onRow={(row: any) => ({
          onClick: () => {
            articleModal.open(row);
          },
          style: { cursor: "pointer" },
        })}
        pagination={{
          pageSize: size,
          current: page,
          total: Math.ceil(total / size),
          showSizeChanger: true,
          onChange: onPaginationTableChange,
        }}
      />

      {articleModal.render()}
    </>
  );
};

export default SharedArticlePage;
