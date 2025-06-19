// altNewsApi.js

import axios from "axios";

const ALT_API_KEY = import.meta.env.VITE_MEDIASTACK_KEY;
const ALT_URL = "http://api.mediastack.com/v1/news";

// 간단한 메모리 캐시
const cache = new Map();

export const fetchAlternativeNews = async (search = "", offset = 0) => {
    const cacheKey = `${search}-${offset}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    try {
        const params = {
            access_key: ALT_API_KEY,
            keywords: search,
            countries: "gb",
            limit: 10,
            offset,
        };

        const response = await axios.get(ALT_URL, { params });
        const rawData = response.data.data || [];

        // ✅ newsapi.org 형식에 맞게 변환
        const formatted = rawData.map(item => ({
            title: item.title,
            description: item.description,
            url: item.url,
            urlToImage: item.image || "",  // mediastack은 'image' 필드 사용
        }));

        cache.set(cacheKey, formatted);
        return formatted;
    } catch (error) {
        console.error("📛 Mediastack 뉴스 가져오기 실패", error.response?.data || error.message);
        return [];
    }
};
