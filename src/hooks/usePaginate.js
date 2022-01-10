import { useState } from "react";

export function usePaginate(cb = null) {
    // paginatie
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const paginationData = {
        hideOnSinglePage: true,
        perPage: pageSize,
        current: pageIndex,
        total: total,
        showSizeChanger: true,
        onChange: (pageIndex, pageSize) => {
            setPageIndex(pageIndex);
            setPageSize(pageSize);
            if (cb) {
                cb()
            }
        },
    };

    return { pageIndex, setPageIndex, pageSize, setPageSize, total, setTotal, paginationData };
}
