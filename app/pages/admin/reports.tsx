import { Table, Typography, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { NextPage } from "next";
import React, { useMemo, useState, useCallback } from "react";
import useReportModal from "../../components/modals/ReportModal/useReportModal";
import { IReport, StatusType, useFetchReports } from "../../api/reports";
import dayjs from "dayjs";

type ReportDataType = IReport & {
  key: string;
};

const { Title } = Typography;

const reportStatus = (status: StatusType): React.ReactNode => {
  switch (status) {
    case StatusType.New:
      return <Tag color="blue">Laporan Baru</Tag>;

    case StatusType.OnCheck:
      return <Tag color="geekblue">Dalam Pengecekan</Tag>;

    case StatusType.Cancelled:
      return <Tag color="orange">Laporan Dibatalkan</Tag>;

    case StatusType.Rejected:
      return <Tag color="red">Laporan Ditolak</Tag>;

    case StatusType.Done:
      return <Tag color="green">Laporan Selesai Diproses</Tag>;

    default:
      return <Tag>-</Tag>;
  }
};

const columns: ColumnsType<ReportDataType> = [
  {
    title: "No. Laporan",
    dataIndex: "reportNo",
    key: "reportNo",
  },
  {
    title: "Status Laporan",
    dataIndex: "status",
    key: "status",
    render: (status) => <>{reportStatus(status)}</>,
  },
  {
    title: "Nama Pelapor",
    dataIndex: "reportedBy",
    key: "reportedBy",
    render: (reportedBy) => <>{reportedBy.userFullName}</>,
  },
  {
    title: "Dilaporkan Pada",
    key: "createdAt",
    dataIndex: "createdAt",
    render: (_, { createdAt }) => (
      <>{dayjs(createdAt).format("DD/MM/YYYY HH:mm")}</>
    ),
  },
];

const AdminReports: NextPage = () => {
  const reportModal = useReportModal();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(10);
  const {
    data: dataSource,
    loading,
    error,
  } = useFetchReports({ page, pageSize: size });
  const reportData = useMemo(() => {
    if (dataSource) {
      setTotal(dataSource.count);
      return dataSource.data || [];
    }

    return [];
  }, [dataSource]);

  const onPaginationTableChange = useCallback(
    (page: number, pageSize: number) => {
      setPage(page);
      setSize(pageSize);
    },
    []
  );

  return (
    <>
      <Title level={3}>Daftar Laporan Warga</Title>

      <Table
        columns={columns}
        dataSource={reportData}
        style={{ marginTop: "20px" }}
        onRow={(row: any) => ({
          onClick: () => {
            reportModal.open(row);
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
      {reportModal.render()}
    </>
  );
};

export default AdminReports;
