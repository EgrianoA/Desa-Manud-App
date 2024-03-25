import { useState } from 'react'
import useApiHooks, { errorResponse } from '../utilities/useApiHooks'

export type HeaderImage = {
    url: String;
    description: String;
    alt: String;
};

export type IArticle = {
    _id: String;
    title: String;
    content: String;
    creatorName: String;
    headerImage: HeaderImage[];
    createdAt: Date;
    
};

type FetchArticleParams = {
    page?: number;
    pageSize?: number;
    query?: string;
}

export const useFetchArticles = ({ page = 1, pageSize = 10, query }: FetchArticleParams) => {
    const [response, setResponse] = useState({ errorResponse })
    const params = `page=${page}&size=${pageSize}${query ? `&query=${JSON.stringify(query)}` : ''}`
    try {
        const response = useApiHooks({
            method: 'get',
            url: `${process.env.BE_BASEURL}/api/articles?${params}`,
        })
        return response
    }
    catch {
        return response
    }
}

export const useFetchArticleBySlugname = ({ slugname }: { slugname: string }) => {
    const [response, setResponse] = useState({ errorResponse })
    try {
        const response = useApiHooks({
            method: 'get',
            url: `${process.env.BE_BASEURL}/api/articles/${slugname}`,
        })
        return response
    }
    catch {
        return response
    }
}