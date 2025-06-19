import axios from "axios";
import { fetchAlternativeNews } from "./altNewsApi";

const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
const BASE_URL = "https://newsapi.org/v2";

export const fetchTopHeadlines = async (category = "", search = "", page = 1) => {
    try {
        const params = {
            country: "us",
            category:"general",
            page,
            pageSize: 9,
            apiKey: API_KEY,
        };
        if (category) params.category = category;
        if (search) params.q = search;

        const response = await axios.get(`${BASE_URL}/top-headlines`, { params });

        // ✅ 뉴스API 응답이 비어있으면 백업 호출
        if (!response.data.articles || response.data.articles.length === 0) {
            console.warn("뉴스API 응답이 비어있음 → 백업 API 사용");
            return await fetchAlternativeNews(search, (page - 1) * 9);
        }

        return response.data.articles;
    } catch (error) {
        // ✅ 네트워크나 인증 오류 발생 시에만 백업 API 호출
        console.error("뉴스API 실패 → 백업 API 호출:", error.response?.data || error.message);
        return await fetchAlternativeNews(search, (page - 1) * 9);
    }
};
