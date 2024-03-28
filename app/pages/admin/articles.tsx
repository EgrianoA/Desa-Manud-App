import { Col, Row, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusCircleOutlined } from "@ant-design/icons";
import type { NextPage } from "next";
import { Button } from "@nextui-org/react";
import React, { useMemo, useState, useCallback } from "react";
import useArticleModal from "../../components/modals/ArticleModal/useArticleModal";
import { IArticle, useFetchArticles } from "../../api/articles";
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

const AdminArticles: NextPage = () => {
  const articleModal = useArticleModal();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(10);
  const {
    data: dataSource,
    loading,
    error,
  } = useFetchArticles({ page, pageSize: size });
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

  return (
    <>
      <Title level={3}>Daftar Artikel</Title>
      <Row style={{ display: "flex", justifyContent: "end" }}>
        <Col>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              articleModal.open(null);
            }}
          >
            Buat Artikel
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

export default AdminArticles;
