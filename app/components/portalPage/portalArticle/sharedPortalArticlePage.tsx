import { uniqBy } from "lodash";
import { Col, Row } from "antd";
import { Text } from "@nextui-org/react";
import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { ArticleKind, IArticle, useFetchArticles } from "../../../api/articles";
import ArticleScollPagination from "../../../components/portalPage/portalArticle/articlesScrollPagination";

const ArticleListContainer = styled.div`
  margin: 40px 30vw;
  .ant-image {
    img {
      aspect-ratio: 16/9;
      object-fit: cover;
      width: 180px;
      height: auto;
      border-radius: 10px;
    }
  }
`;

const SharedArticleList = ({ articleKind }: { articleKind: ArticleKind }) => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [articleData, setArticleData] = useState<IArticle[]>([]);

  const {
    data: dataSource,
    loading,
    error,
  } = useFetchArticles({
    page,
    pageSize: size,
    query: { types: [articleKind] },
  });

  useEffect(() => {
    if (dataSource) {
      setTotal(dataSource.count);
      if (size > dataSource.count) {
        setSize(dataSource.count);
      }
      if (dataSource.data.length) {
        return setArticleData(
          uniqBy([...articleData, ...dataSource.data], "_id")
        );
      }
    }
  }, [dataSource, size]);

  const pageTitle = useMemo(() => {
    switch (articleKind) {
      case ArticleKind.Kebersihan:
        return "Daftar Informasi Program Kebersihan";

      case ArticleKind.Kesehatan:
        return "Daftar Informasi Program Kesehatan";

      case ArticleKind.Kemitraan:
        return "Daftar Informasi Kemitraan";

      case ArticleKind.ProgramKerja:
        return "Daftar Informasi Program Kerja";

      default:
        return "Daftar Informasi & Berita Desa";
    }
  }, [articleKind]);

  return (
    <ArticleListContainer>
      <Col>
        <Row style={{ marginBottom: "40px" }}>
          <Text h3>{pageTitle}</Text>
        </Row>
        <Row>
          <ArticleScollPagination
            setPage={setPage}
            articleData={articleData}
            page={page}
            total={total}
            articleKind={articleKind}
          />
        </Row>
      </Col>
    </ArticleListContainer>
  );
};

export default SharedArticleList;
