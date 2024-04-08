import type { NextPage } from "next";
import { ArticleKind } from "../../api/articles";
import SharedArticleList from "../../components/portalPage/portalArticle/sharedPortalArticlePage";

const Article: NextPage = () => {
  return <SharedArticleList articleKind={ArticleKind.Kemitraan} />;
};

export default Article;
