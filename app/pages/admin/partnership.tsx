import { NextPage } from "next";
import SharedArticlePage from "../../components/sharedArticlePage";
import { ArticleKind } from "../../api/articles";

const AdminAchievements: NextPage = () => {
  return <SharedArticlePage articleKind={ArticleKind.Kemitraan} />;
};

export default AdminAchievements;
