import { Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, UserOutlined, PlusCircleOutlined } from '@ant-design/icons'
import type { NextPage } from 'next';
import { Button, Text } from '@nextui-org/react';
import { Flex } from '../../components/styles/flex';
import React, { useMemo, useState, useCallback } from 'react';
import useArticleModal from '../../components/modals/ArticleModal/useArticleModal'
import { Breadcrumbs, Crumb, CrumbLink } from '../../components/breadcrumb/breadcrumb.styled';
import { IArticle, useFetchArticles } from '../../api/articles'
import dayjs from 'dayjs'
import { useUserContext } from '../../utilities/authorization'

type ArticleDataType = IArticle & {
    key: string;
};

const columns: ColumnsType<ArticleDataType> = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Nama Penulis',
        dataIndex: 'creator',
        key: 'creator',
        render: (creator) => <>{creator.userFullName}</>
    },
    {
        title: 'Dibuat Pada',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (_, { createdAt }) => (
            <>{dayjs(createdAt).format('DD/MM/YYYY HH:mm')}</>
        ),
    },
];

const AdminArticles: NextPage = () => {
    const articleModal = useArticleModal();
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
                    <CrumbLink>Artikel</CrumbLink>
                    <Text>/</Text>
                </Crumb>
                <Crumb>
                    <CrumbLink>Daftar Artikel</CrumbLink>
                </Crumb>
            </Breadcrumbs>

            <Text h3>Daftar Artikel</Text>
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
                            articleModal.open(null);
                        }}>
                        Buat Artikel
                    </Button>
                </Flex>
            </Flex>

            <Table
                columns={columns}
                dataSource={articleData}
                style={{ marginTop: '20px' }}
                onRow={(row: any) => ({
                    onClick: () => {
                        articleModal.open(row, userContext.role);
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
            {articleModal.render()}
        </>
    );
};

export default AdminArticles;
