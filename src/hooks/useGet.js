import { useState, useEffect } from "react";
import axios from "axios";

export function useGet(url, params = null, dependencyArray = []) {
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        await axios.post(url, params).then(({ data }) => {
            setDataList(data);
        });
        setLoading(false);
    }, dependencyArray);

    return { dataList, loading, setLoading };
}
