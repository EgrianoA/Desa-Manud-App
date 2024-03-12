import { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { getAuthorization, useUserContext } from './authorization'

type ApiHooksType = {
    method: string,
    url: string,
    body?: any
}

export const errorResponse = {
    data: null,
    loading: false,
    error: 'Catch Error'
}

const useApiHooks = ({ method, url, body }: ApiHooksType) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userContext = useUserContext();

    try {
        useEffect(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response: AxiosResponse<T> = await axios({ method, url, data: body, ...getAuthorization(userContext?.token || '') });
                    setData(response.data);
                    setLoading(false);
                } catch (error) {
                    setError("Error getting the data");
                    setLoading(false);
                }
            };

            fetchData();
        }, [body, method, url, userContext?.token]);
        return { data, loading, error };
    }
    catch (e) {
        console.log(e)
        return { data, loading, error }
    }
}

export default useApiHooks