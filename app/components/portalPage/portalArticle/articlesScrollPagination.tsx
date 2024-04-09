import { useCallback, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ArticleKind, IArticle } from "../../../api/articles";
import { Card, Col, Row, Image, Grid } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import getFileUrl from "../../../utilities/getFileUrl";
import { shortenContent } from "../../../utilities/contentManipulation";

type ArticleScrollPaginationProps = {
  setPage: (page: number) => void;
  articleData: IArticle[];
  page: number;
  total: number;
  articleKind: ArticleKind;
};

const { useBreakpoint } = Grid;

const ArticleScollPagination = ({
  articleData,
  page,
  setPage,
  total,
  articleKind,
}: ArticleScrollPaginationProps) => {
  const router = useRouter();
  const screens = useBreakpoint();

  const refresh = useCallback(() => {
    console.log("ON REFRESH");
  }, []);
  const refetchData = useCallback(() => {
    if (articleData.length < total) {
      setPage(page + 1);
    }
  }, [articleData.length, page, total]);

  const articleRouter = useMemo(() => {
    switch (articleKind) {
      case ArticleKind.Kebersihan:
        return "program-kebersihan";

      case ArticleKind.Kemitraan:
        return "informasi-kemitraan";

      case ArticleKind.Kesehatan:
        return "program-kesehatan";

      case ArticleKind.ProgramKerja:
        return "pencapaian-program-kerja";

      default:
        return "artikel";
    }
  }, [articleKind]);

  const cardWidth = useMemo(() => {
    if (screens.xxl) {
      return { width: "40vw", marginBottom: "20px" };
    }
    if (screens.xl) {
      return { width: "60vw", marginBottom: "20px" };
    }
    if (screens.sm || screens.lg) {
      return { width: "75vw", marginBottom: "20px" };
    }
    if (screens.xs) {
      return { width: "90vw", marginBottom: "20px" };
    }
  }, [screens]);

  const cardSpan = {
    image: { xs: 8, lg: 6, xl: 5 },
    content: { xs: 15, lg: 17, xl: 18 },
  };

  return (
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
        <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
      }
    >
      {articleData.map((article) => (
        <Card
          title={`${dayjs(article.createdAt).format("DD/MM/YYYY HH:mm")} - ${
            article.title
          }`}
          bordered={false}
          style={{ ...cardWidth }}
          hoverable
          key={article.slugname}
          onClick={() => router.push(`/${articleRouter}/${article.slugname}`)}
        >
          <Row gutter={16}>
            <Col {...cardSpan.image}>
              <Image
                preview={false}
                src={getFileUrl(article?.headerImage[0])}
                alt={article?.headerImage[0]?.alt || ""}
              />
            </Col>
            <Col {...cardSpan.content} style={{ marginLeft: "20px" }}>
              <p>{shortenContent(article.content.replaceAll("\n", " "))}</p>
            </Col>
          </Row>
        </Card>
      ))}
    </InfiniteScroll>
  );
};

export default ArticleScollPagination;
