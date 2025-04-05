import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetchInstagramStatistics(initialData, userName) {
    const [data, setData] = useState(initialData)
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async (userName) => {
        setIsLoading(true)
        try {
            const res = await axios({
                method: "get",
                url: "http://localhost:8000/details",
                params: {
                    userName
                },
            })
            setData(res.data.data)
        } catch (error) {
            alert(error?.response?.data?.message || "Could not fetch influencer details")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // if (url && (url.startsWith("https://instagram") || url.startsWith("https://www.instagram"))) {
        //     fetchData(url)
        //     console.log("running");
        // }

        fetchData(userName)
        
    }, [userName])

    return { data, isLoading }
}