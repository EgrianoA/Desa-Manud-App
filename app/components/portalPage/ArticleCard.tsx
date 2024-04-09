import { Grid, Card } from "antd";
import styled from "styled-components";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { shortenContent } from "../../utilities/contentManipulation";
import { useMemo } from "react";

type ArticleContent = {
  image: string;
  title: string;
  content: string;
  slugname: string;
  alt: string;
  createdAt: Date;
};

const { useBreakpoint } = Grid;

const ArticleCard = ({ articleData }: { articleData: ArticleContent[] }) => {
  const screens = useBreakpoint();
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
  const router = useRouter();
  return articleData.map((article) => (
    <Card
      title={`${dayjs(article.createdAt).format("DD/MM/YYYY HH:mm")} - ${
        article.title
      }`}
      bordered={false}
      style={{ ...cardWidth }}
      hoverable
      key={article.slugname}
      onClick={() => router.push(`/artikel/${article.slugname}`)}
    >
      <p>{shortenContent(article.content.replaceAll("\n", " "))}</p>
    </Card>
  ));
};

export default ArticleCard;
