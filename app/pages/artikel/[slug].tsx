import type { NextPage } from "next";
import { Text } from "@nextui-org/react";
import styled from "styled-components";
import { Image } from "antd";
import { useRouter } from "next/router";
import { IArticle, useFetchArticleBySlugname } from "../../api/articles";
import { useMemo } from "react";
import dayjs from "dayjs";
import { createBrNewLine } from "../../utilities/contentManipulation";
import getFileUrl from "../../utilities/getFileUrl";
import { isArray } from "lodash/fp";

const ArticleDetailContainer = styled.div`
  margin: 40px 30vw;
  img {
    aspect-ratio: 16/9;
    object-fit: cover;
    width: 25vw;
    height: auto;
  }
`;

const ArticleDetail: NextPage = () => {
  const router = useRouter();

  const slug: string = useMemo(() => {
    if (router.query.slug) {
      if (!isArray(router.query.slug)) {
        return router.query.slug;
      }
    }
    return "";
  }, [router.query.slug]);

  const {
    data: dataSource,
    loading,
    error,
  } = useFetchArticleBySlugname({
    slugname: slug,
  });

  const articleData: IArticle = useMemo(() => {
    if (dataSource?.data) {
      return !isArray(dataSource.data) ? dataSource.data : null;
    }

    return null;
  }, [dataSource]);

  const content = useMemo(
    () => createBrNewLine(articleData?.content),
    [articleData?.content]
  );
  const imageData = useMemo(
    () => ({
      src: getFileUrl(articleData?.headerImage[0]),
      alt: articleData?.headerImage[0]?.alt || "",
    }),
    [articleData?.headerImage]
  );

  console.log({ dataSource, slug });

  return (
    slug !== "" &&
    articleData && (
      <ArticleDetailContainer>
        <Text h3>{articleData.title}</Text>
        <p>
          Oleh {articleData.creator.userFullName} pada{" "}
          {dayjs(articleData.createdAt).format("DD-MM-YYYY HH:mm")}
        </p>
        <Image preview={false} src={imageData.src} alt={imageData.alt} />
        <br />
        <br />
        <p style={{ fontSize: "16px" }}>{content}</p>
      </ArticleDetailContainer>
    )
  );
};

export default ArticleDetail;
