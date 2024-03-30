import type { NextPage } from "next";
import { uniqBy } from "lodash";
import { Card, Col, Row, Image } from "antd";
import { Text } from "@nextui-org/react";
import { useMemo, useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { useFetchArticles } from "../../api/articles";
import InfiniteScroll from "react-infinite-scroll-component";

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
const shortenContent = (content: string) => {
  if (content.length > 250) {
    return `${content.slice(0, 250)}...`;
  }
  return content;
};

const Article: NextPage = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [articleData, setArticleData] = useState([]);

  const {
    data: dataSource,
    loading,
    error,
  } = useFetchArticles({ page, pageSize: size });
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

  const refresh = useCallback(() => {
    console.log("ON REFRESH", values);
  }, []);
  const refetchData = useCallback(() => {
    if (articleData.length < total) {
      setPage(page + 1);
    }
  }, [articleData.length, page, total]);

  return (
    <ArticleListContainer>
      <Col>
        <Row style={{ marginBottom: "40px" }}>
          <Text h3>Daftar Informasi & Berita desa</Text>
        </Row>
        <Row>
          <InfiniteScroll
            dataLength={total} //This is important field to render the next data
            next={refetchData}
            hasMore={total > articleData.length}
            loader={<h4>memuat...</h4>}
            // below props only if you need pull down functionality
            refreshFunction={refresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8595; Pull down to refresh
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8593; Release to refresh
              </h3>
            }
          >
            {articleData.map((article) => (
              <Card
                title={`${dayjs(article.createdAt).format(
                  "DD/MM/YYYY HH:mm"
                )} - ${article.title}`}
                bordered={false}
                style={{ width: "40vw", marginBottom: "20px" }}
                hoverable
                key={article.slugname}
                onClick={() => router.push(`/artikel/${article.slugname}`)}
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Image
                      preview={false}
                      src={article?.headerImage[0]?.url || ""}
                      alt={article?.headerImage[0]?.alt || ""}
                    />
                  </Col>
                  <Col span={18}>
                    <p>
                      {shortenContent(article.content.replaceAll("\n", " "))}
                    </p>
                  </Col>
                </Row>
              </Card>
            ))}
          </InfiniteScroll>
        </Row>
      </Col>
    </ArticleListContainer>
  );
};

export default Article;
