import type { NextPage } from "next";
import { uniqBy } from "lodash";
import { Col, Row } from "antd";
import { Text } from "@nextui-org/react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { ArticleKind, IArticle, useFetchArticles } from "../../api/articles";
import ArticleScollPagination from "../../components/articlesScrollPagination";

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

const Article: NextPage = () => {
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
    query: { types: [ArticleKind.Kebersihan] },
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

  return (
    <ArticleListContainer>
      <Col>
        <Row style={{ marginBottom: "40px" }}>
          <Text h3>Daftar Informasi Program Kebersihan</Text>
        </Row>
        <Row>
          <ArticleScollPagination
            setPage={setPage}
            articleData={articleData}
            page={page}
            total={total}
            articleRouter="program-kebersihan"
          />
        </Row>
      </Col>
    </ArticleListContainer>
  );
};

export default Article;
