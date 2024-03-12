import { useMemo } from 'react';
import { Text } from '@nextui-org/react';
import type { NextPage } from 'next';
import { Breadcrumbs, Crumb, CrumbLink } from '../../components/breadcrumb/breadcrumb.styled';
import { Flex } from '../../components/styles/flex';
import type { ColumnsType } from 'antd/es/table';
import { Input, Table, Tag, Row, Col, Card, Statistic, List, Descriptions } from 'antd';
import { HomeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useUserContext } from '../../utilities/authorization'


const Home: NextPage = () => {
   const userContext = useUserContext();
   const userFullname = useMemo(() => (userContext?.userFullName), [userContext?.userFullName])
   return (
      <Flex
         css={{
            'mt': '$5',
            'px': '$6',
            '@sm': {
               mt: '$10',
               px: '$16',
            },
         }}
         justify={'center'}
         direction={'column'}
      >
         <Breadcrumbs>
            <Crumb>
               <HomeOutlined />
               <CrumbLink>Beranda</CrumbLink>
            </Crumb>
         </Breadcrumbs>

         <Text h3>Hi {userFullname}, selamat datang di aplikasi pengelolaan informasi Desa Manud</Text>
         <br />
      </Flex>
   );
};

export default Home;
