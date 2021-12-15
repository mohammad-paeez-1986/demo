import { useState, useEffect } from "react";
import axios from "axios";

export default function useGetWelfareId(uri) {
    const [id, setId] = useState(null);

    useEffect(async () => {
        // const type = url.split("/")[1]?.toUpperCase();
        await axios.post("Welfare/Get", { type: "CAFE" }).then(({ data }) => {
            // console.log(data);
            setId(data[0].id);
            // setWelfareId(data[0].id);
        });
    });

    return id;
}
