import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTopHeadlines } from "../api/newsApi";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function ArticlePage() {
    const { index } = useParams();
    const [article, setArticle] = useState(null);
    const [summary, setSummary] = useState("");

    useEffect(() => {
        const load = async () => {
            const data = await fetchTopHeadlines();
            setArticle(data[index]);
        };
        load();
    }, [index]);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!article) return;

            const prompt = `다음 뉴스 내용을 한국어로 3줄로 요약해줘:\n\n${article.title}\n\n${article.description}`;
            console.log("[GPT 요청] 프롬프트:", prompt);

            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 150,
                    temperature: 0.7,
                }),
            });

            const data = await res.json();
            console.log("[GPT 응답]", data);

            if (data.choices?.[0]?.message?.content) {
                setSummary(data.choices[0].message.content.trim());
            }
        };

        fetchSummary();
    }, [article]);

    if (!article) {
        return <div className="p-6 text-gray-500">기사를 불러오는 중...</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white text-black dark:bg-gray-900 dark:text-white">
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                ← 홈으로
            </Link>

            <h1 className="text-3xl font-bold mt-4 mb-2">{article.title}</h1>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {article.source?.name || "Unknown"} · {new Date(article.publishedAt).toLocaleString()}
            </div>

            {article.urlToImage && (
                <img
                    src={article.urlToImage}
                    alt="article"
                    className="w-full h-64 object-cover rounded mb-6"
                />
            )}

            {summary && (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-6">
                    <h3 className="font-semibold mb-2">📝 GPT 요약</h3>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{summary}</p>
                </div>
            )}

            <p className="text-lg leading-relaxed mb-6">{article.description || "내용 없음"}</p>

            <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                원문 보기 →
            </a>
        </div>
    );
}

export default ArticlePage;
