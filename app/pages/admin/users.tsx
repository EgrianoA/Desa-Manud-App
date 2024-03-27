import { Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { NextPage } from "next";
import React, { useMemo, useState, useCallback } from "react";
import useUserModal from "../../components/modals/UserModal/useUserModal";
import {
  generateRoleTagColor,
  generateRoleName,
} from "../../utilities/generateTag";
import { IUser, useFetchUsers } from "../../api/users";
import { useUserContext } from "../../utilities/authorization";

type UserDataType = IUser & {
  key: string;
};

const { Title } = Typography;

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
  const {
    data: dataSource,
    loading,
    error,
  } = useFetchUsers({ page, pageSize: size });
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
      <Title level={3}>Daftar Pengguna</Title>

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
