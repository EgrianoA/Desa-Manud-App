import { useMemo } from "react";
import type { NextPage } from "next";
import {
  Input,
  Table,
  Tag,
  Row,
  Col,
  Card,
  Statistic,
  List,
  Descriptions,
  Typography,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useUserContext } from "../../utilities/authorization";

const { Title } = Typography;

const Home: NextPage = () => {
  const userContext = useUserContext();
  const userFullname = useMemo(
    () => userContext?.userFullName,
    [userContext?.userFullName]
  );
  return (
    <Title level={3}>
      Hi {userFullname}, selamat datang di aplikasi pengelolaan informasi Desa
      Manud
    </Title>
  );
};

export default Home;
