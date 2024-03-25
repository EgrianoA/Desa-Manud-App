import { Input, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  UserOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { NextPage } from "next";
import { Button, Text } from "@nextui-org/react";
import { UsersIcon } from "../../components/icons/breadcrumb/users-icon";
import { Flex } from "../../components/styles/flex";
import Link from "next/link";
import React, { useMemo, useState, useCallback } from "react";
import useUserModal from "../../components/modals/UserModal/useUserModal";
import {
  Breadcrumbs,
  Crumb,
  CrumbLink,
} from "../../components/breadcrumb/breadcrumb.styled";
import {
  generateRoleTagColor,
  generateRoleName,
} from "../../utilities/generateTag";
import { IUser, useFetchUsers } from "../../api/users";
import { useUserContext } from "../../utilities/authorization";

type UserDataType = IUser & {
  key: string;
};

const columns: ColumnsType<UserDataType> = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    key: "role",
    dataIndex: "role",
    render: (_, { role }) => (
      <>
        <Tag color={generateRoleTagColor(role)} key={role}>
          {generateRoleName(role)}
        </Tag>
      </>
    ),
  },
];

const AdminUsers: NextPage = () => {
  const userModal = useUserModal();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(10);
  const { data: dataSource, loading, error } = useFetchUsers({ page, size });
  const userData = useMemo(() => {
    if (dataSource) {
      setTotal(dataSource.count);
      return dataSource.data || [];
    }

    return [];
  }, [dataSource]);

  const userContext = useUserContext();
  const onPaginationTableChange = useCallback(
    (page: number, pageSize: number) => {
      setPage(page);
      setSize(pageSize);
      console.log({ page, pageSize });
    },
    []
  );

  return (
    <>
      <Breadcrumbs>
        <Crumb>
          <UserOutlined />
          <CrumbLink>Pengguna</CrumbLink>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <CrumbLink>Daftar Pengguna</CrumbLink>
        </Crumb>
      </Breadcrumbs>

      <Text h3>Daftar Pengguna</Text>
      <Flex
        css={{ gap: "$8" }}
        align={"center"}
        justify={"between"}
        wrap={"wrap"}
      >
        <Flex
          css={{
            gap: "$6",
            flexWrap: "wrap",
            "@sm": { flexWrap: "nowrap" },
          }}
          align={"center"}
        >
          <Input placeholder="Cari Akun" suffix={<SearchOutlined />} />
        </Flex>
      </Flex>

      <Table
        columns={columns}
        dataSource={userData}
        style={{ marginTop: "20px" }}
        onRow={(row: any) => ({
          onClick: () => {
            userModal.open(row, userContext.role);
          },
          style: { cursor: "pointer" },
        })}
        pagination={{
          pageSize: size,
          current: page,
          total: Math.ceil(total / size),
          showSizeChanger: true,
          onChange: onPaginationTableChange,
        }}
      />
      {userModal.render()}
    </>
  );
};

export default AdminUsers;
