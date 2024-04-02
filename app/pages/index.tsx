import { Text } from "@nextui-org/react";
import { NextPage } from "next/types";
import { Row, Col, Button } from "antd";
import styled from "styled-components";
import Carousel from "../components/portalPage/Carousel";
import ArticleCard from "../components/portalPage/ArticleCard";
import React, { useMemo, useState, useCallback } from "react";
import { IArticle, useFetchArticles } from "../api/articles";
import getFileUrl from "../utilities/getFileUrl";

const sectionStyle = {
  minHeight: "20vh",
};

const Home: NextPage = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const {
    data: dataSource,
    loading,
    error,
  } = useFetchArticles({ page, pageSize: size });
  const articleSourceData = useMemo(() => {
    if (dataSource) {
      return dataSource.data || [];
    }

    return [];
  }, [dataSource]);

  const articleData = useMemo(
    () =>
      articleSourceData.map((article: IArticle) => ({
        image: getFileUrl(article.headerImage[0]),
        title: article.title,
        content: article.content,
        slugname: article.slugname,
        alt: article.headerImage[0]?.alt || "",
        createdAt: article.createdAt,
      })),
    [articleSourceData]
  );

  return (
    <div style={{}}>
      <Row style={{ backgroundColor: "blue" }}>
        <Carousel carouselData={articleData.slice(0, 3)} />
      </Row>
      <div style={{ padding: "40px 15vw" }}>
        <Row style={sectionStyle}>
          <Col span={24}>
            <Row
              style={{
                marginBottom: "40px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Text h3>Informasi & Berita Desa</Text>
            </Row>
            <Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <ArticleCard articleData={articleData.slice(0, 5)} />
              </div>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
