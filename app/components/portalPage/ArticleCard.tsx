import { Button, Card } from "antd";
import styled from "styled-components";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { shortenContent } from "../../utilities/contentManipulation";

type ArticleContent = {
  image: string;
  title: string;
  content: string;
  slugname: string;
  alt: string;
  createdAt: Date;
};

const ArticleCard = ({ articleData }: { articleData: ArticleContent[] }) => {
  const router = useRouter();
  return articleData.map((article) => (
    <Card
      title={`${dayjs(article.createdAt).format("DD/MM/YYYY HH:mm")} - ${
        article.title
      }`}
      bordered={false}
      style={{ width: "40vw", marginBottom: "20px" }}
      hoverable
      key={article.slugname}
      onClick={() => router.push(`/artikel/${article.slugname}`)}
    >
      <p>{shortenContent(article.content.replaceAll("\n", " "))}</p>
    </Card>
  ));
};

export default ArticleCard;
