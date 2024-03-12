import { Button, Text } from '@nextui-org/react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { Breadcrumbs, Crumb, CrumbLink } from '../breadcrumb/breadcrumb.styled';
import { UsersIcon } from '../icons/breadcrumb/users-icon';
import { Flex } from '../styles/flex';
import { Input, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons'
import userData from '../../../akpsi-backend/fixture/user.json'

interface DataType {
   key: string;
   employeeNumber: string;
   username: string;
   fullName: string;
   role: string;
}

const columns: ColumnsType<DataType> = [
   {
      title: 'No. Karyawan',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
   },
   {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
   },
   {
      title: 'Nama Karyawan',
      dataIndex: 'fullName',
      key: 'fullName',
   },
   {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
      render: (_, { role }) => (
         <>
            <Tag color="lime" key={role}>
               {role.toUpperCase()}
            </Tag>
         </>
      ),
   },
];

export const Accounts = () => {

   const dataSource = useMemo(() => {
      return userData.map((user) => ({
         key: user.userId,
         employeeNumber: user.employeeNumber,
         username: user.username,
         fullName: user.fullName,
         role: user.role
      }))
   }, [userData])
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
               <UsersIcon />
               <CrumbLink>Pengguna</CrumbLink>
               <Text>/</Text>
            </Crumb>
            <Crumb>
               <CrumbLink>Daftar Pengguna</CrumbLink>
            </Crumb>
         </Breadcrumbs>

         <Text h3>Daftar Akun</Text>
         <Flex
            css={{ gap: '$8' }}
            align={'center'}
            justify={'between'}
            wrap={'wrap'}
         >
            <Flex
               css={{
                  'gap': '$6',
                  'flexWrap': 'wrap',
                  '@sm': { flexWrap: 'nowrap' },
               }}
               align={'center'}
            >
               <Input
                  placeholder="Cari Akun"
                  suffix={
                     <SearchOutlined />
                  }
               />
            </Flex>
         </Flex>

         <Table columns={columns} dataSource={dataSource} style={{ marginTop: '20px' }} />
      </Flex>
   );
};
