import { Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, UserOutlined, PlusCircleOutlined } from '@ant-design/icons'
import type { NextPage } from 'next';
import { Button, Text } from '@nextui-org/react';
import { Flex } from '../../components/styles/flex';
import React, { useMemo, useState, useCallback } from 'react';
import useReportModal from '../../components/modals/ReportModal/useReportModal'
import { Breadcrumbs, Crumb, CrumbLink } from '../../components/breadcrumb/breadcrumb.styled';
import { IArticle, useFetchArticles } from '../../api/reports'
import dayjs from 'dayjs'
import { useUserContext } from '../../utilities/authorization'

type ArticleDataType = IArticle & {
    key: string;
};

const columns: ColumnsType<ArticleDataType> = [
    {
        title: 'Laporan',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Nama Pelapor',
        dataIndex: 'creator',
        key: 'creator',
        render: (creator) => <>{creator.userFullName}</>
    },
    {
        title: 'Dilaporkan Pada',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (_, { createdAt }) => (
            <>{dayjs(createdAt).format('DD/MM/YYYY HH:mm')}</>
        ),
    },
];

const AdminArticles: NextPage = () => {
    const reportModal = useReportModal();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(10);
    const { data: dataSource, loading, error } = useFetchArticles({ page, size });
    const articleData = useMemo(() => {
        if (dataSource) {
            setTotal(dataSource.count);
            return dataSource.data || []
        }

        return []
    }, [dataSource])



    const userContext = useUserContext();
    const onPaginationTableChange = useCallback((page, pageSize) => {
        setPage(page)
        setSize(pageSize)
    }, [])


    return (
        <>
            <Breadcrumbs>
                <Crumb>
                    <UserOutlined />
                    <CrumbLink>Laporan</CrumbLink>
                    <Text>/</Text>
                </Crumb>
                <Crumb>
                    <CrumbLink>Laporan Warga</CrumbLink>
                </Crumb>
            </Breadcrumbs>

            <Text h3>Laporan Warga</Text>
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
                <Flex direction={'row'} css={{ gap: '$6' }} wrap={'wrap'}>
                    <Button
                        icon={<PlusCircleOutlined />}
                        onClick={() => {
                            reportModal.open(null);
                        }}>
                        Buat Laporan
                    </Button>
                </Flex>
            </Flex>

            <Table
                columns={columns}
                dataSource={articleData}
                style={{ marginTop: '20px' }}
                onRow={(row: any) => ({
                    onClick: () => {
                        reportModal.open(row, userContext.role);
                    },
                    style: { cursor: 'pointer' },
                })}
                pagination={{
                    pageSize: size,
                    current: page,
                    total: Math.ceil(total / size),
                    showSizeChanger: true,
                    onChange: onPaginationTableChange
                }}
            />
            {reportModal.render()}
        </>
    );
};

export default AdminArticles;
