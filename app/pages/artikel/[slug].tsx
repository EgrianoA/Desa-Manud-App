import type { NextPage } from 'next';
import { Text } from '@nextui-org/react';
import styled from 'styled-components'
import { Image } from 'antd'
import { useRouter } from 'next/router';
import { useFetchArticleBySlugname } from '../../api/articles'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import { createBrNewLine } from '../../utilities/contentManipulation'

const ArticleDetailContainer = styled.div`
    margin: 40px 30vw;
    img {
        aspect-ratio: 16/9;
        object-fit: cover;
        width: 25vw;
        height: auto;
    }
`

const ArticleDetail: NextPage = () => {

    const router = useRouter();
    const { data: dataSource, loading, error } = useFetchArticleBySlugname({ slugname: router.query.slug });
    const articleData = useMemo(() => {
        if (dataSource) {
            return dataSource.data || null
        }

        return null
    }, [dataSource])

    const content = useMemo(() => createBrNewLine(articleData?.content), [articleData?.content])
    const imageData = useMemo(() => ({
        src: articleData?.headerImage[0]?.url || '',
        alt: articleData?.headerImage[0]?.alt || ''
    }), [articleData?.headerImage])

    return articleData && (
        <ArticleDetailContainer>
            <Text h3>{articleData.title}</Text>
            <p>Oleh {articleData.creator.userFullName} pada {dayjs(articleData.createdAt).format('DD-MM-YYYY HH:mm')}</p>
            <Image
                preview={false}
                src={imageData.src}
                alt={imageData.alt}
            />
            <br /><br />
            <p style={{ fontSize: '16px' }}>{content}</p>
        </ArticleDetailContainer >
    );
};

export default ArticleDetail;
