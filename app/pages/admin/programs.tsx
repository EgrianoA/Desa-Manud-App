import { Input, Table, Typography, Row, Col, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusCircleOutlined } from "@ant-design/icons";
import type { NextPage } from "next";
import { Button, Text } from "@nextui-org/react";
import React, { useMemo, useState, useCallback } from "react";
import useProgramModal from "../../components/modals/ProgramModal/useProgramModal";
import { ArticleKind, IArticle, useFetchArticles } from "../../api/articles";
import dayjs from "dayjs";
import { useUserContext } from "../../utilities/authorization";

type ProgramDataType = IArticle & {
  key: string;
};

const programType = (program: ArticleKind): React.ReactNode => {
  switch (program) {
    case ArticleKind.Kebersihan:
      return <Tag color="blue">Kebersihan</Tag>;

    case ArticleKind.Kesehatan:
      return <Tag color="green">Kesehatan</Tag>;

    default:
      return <Tag>{program}</Tag>;
  }
};

const { Title } = Typography;

const columns: ColumnsType<ProgramDataType> = [
  {
    title: "Program",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Tipe Program",
    dataIndex: "type",
    key: "type",
    render: (type) => <>{programType(type)}</>,
  },
  {
    title: "Nama Pembuat",
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

const AdminPrograms: NextPage = () => {
  const programModal = useProgramModal();
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
    query: { types: [ArticleKind.Kebersihan, ArticleKind.Kesehatan] },
  });
  const articleData = useMemo(() => {
    if (dataSource) {
      setTotal(dataSource.count);
      return dataSource.data || [];
    }

    return [];
  }, [dataSource]);

  const userContext = useUserContext();
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
              programModal.open(null);
            }}
          >
            Buat Program
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={articleData}
        style={{ marginTop: "20px" }}
        onRow={(row: any) => ({
          onClick: () => {
            programModal.open(row, userContext.role);
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
      {programModal.render()}
    </>
  );
};

export default AdminPrograms;
