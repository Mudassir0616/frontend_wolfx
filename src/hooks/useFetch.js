"use client"
import { useState, useEffect, useCallback } from "react"
import useUpdateEffect from "./useUpdateEffect";

export default function useFetch(api_endpoint, initialPath, initialPageSize = 10) {

    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [blur, setBlur] = useState(false);
    const [is_loading, setIs_loading] = useState(false)

    const fetchData = useCallback(async (path, pageSize = initialPageSize, page = 1) => {
        setIs_loading(true)
        try {
            const response = await api_endpoint.get(`?${path}`);
            const totalItems = response?.total_items;
            setData(response);
            setPageCount(Math.ceil(totalItems / pageSize));

        } catch (err) {
            setError(err);
        } finally {
            setIs_loading(false)
        }
    }, [api_endpoint, initialPageSize]);

    const fetchInitialData = useCallback(() => {
        fetchData(initialPath, initialPageSize, currentPage);
    }, [fetchData, initialPath, initialPageSize, currentPage]);

    const fetchNextPageData = (selectedPage) => {
        fetchData(initialPath, initialPageSize, selectedPage);
    };

    const setPageSelected = ({ selected }) => {
        const nextPage = selected + 1;
        setCurrentPage(nextPage);
        fetchNextPageData(nextPage);
    };

    const deleteItem = async (e, id_array) => {
        e.preventDefault();
        setIs_loading(true);
        try {
            await Promise.all(id_array?.map(id => api_endpoint.delete(`/${id}`)));
            await fetchData(initialPath, initialPageSize, currentPage);
        } catch (err) {
            setError(err);
        } finally {
            setIs_loading(false);
        }
    };

    useUpdateEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    return { data, setData, pageCount, setPageSelected, error, blur, fetchData, fetchNextPageData, deleteItem, is_loading, setIs_loading };
};