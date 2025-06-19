import { useEffect, useRef, useState, useCallback } from "react";
import { fetchTopHeadlines } from "../api/newsApi";
import { fetchAlternativeNews } from "../api/altNewsApi";
import NewsCard from "../components/NewsCard";
import { useNavigate } from "react-router-dom";

const categories = [
    { label: "전체", value: "" },
    { label: "비즈니스", value: "business" },
    { label: "기술", value: "technology" },
    { label: "건강", value: "health" },
    { label: "과학", value: "science" },
    { label: "스포츠", value: "sports" },
    { label: "엔터", value: "entertainment" },
];

function HomePage() {
    const [articles, setArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem("searchHistory");
        return saved ? JSON.parse(saved) : [];
    });
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [bookmarks, setBookmarks] = useState(() => {
        const saved = localStorage.getItem("bookmarks");
        return saved ? JSON.parse(saved) : [];
    });

    const loaderRef = useRef(null);
    const navigate = useNavigate();
    const loadedPages = useRef(new Set());
    const pageSize = 9;

    const loadArticles = useCallback(async () => {
        if (isLoading || isEnd || loadedPages.current.has(page)) return;

        setIsLoading(true);
        let data = await fetchTopHeadlines(selectedCategory, searchTerm, page);

        if (!data || data.length === 0) {
            const altData = await fetchAlternativeNews(searchTerm, (page - 1) * pageSize);
            data = altData.map((item) => ({
                title: item.title,
                description: item.description,
                url: item.url,
                urlToImage: item.image,
                publishedAt: item.published_at,
                source: typeof item.source === "string" ? { name: item.source } : item.source,
            }));
        }

        if (data.length < pageSize) {
            setIsEnd(true);
        }

        loadedPages.current.add(page);
        setArticles((prev) => (page === 1 ? data : [...prev, ...data]));
        setIsLoading(false);
    }, [selectedCategory, searchTerm, page, isLoading, isEnd]);

    useEffect(() => {
        setArticles([]);
        setPage(1);
        setIsEnd(false);
        loadedPages.current.clear();
    }, [selectedCategory, searchTerm]);

    useEffect(() => {
        loadArticles();
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && !isEnd) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );
        const target = loaderRef.current;
        if (target) observer.observe(target);
        return () => {
            if (target) observer.unobserve(target);
        };
    }, [isLoading, isEnd]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(inputValue);

        if (inputValue && !searchHistory.includes(inputValue)) {
            const updated = [inputValue, ...searchHistory].slice(0, 10);
            setSearchHistory(updated);
            localStorage.setItem("searchHistory", JSON.stringify(updated));
        }
    };

    const handleTitleClick = () => {
        setSearchTerm("");
        setInputValue("");
        setSelectedCategory("");
        setPage(1);
        setArticles([]);
        setIsEnd(false);
        loadedPages.current.clear();
    };

    const addBookmark = (article) => {
        if (!bookmarks.find((item) => item.url === article.url)) {
            const updated = [...bookmarks, article];
            setBookmarks(updated);
            localStorage.setItem("bookmarks", JSON.stringify(updated));
        }
    };

    const removeBookmark = (url) => {
        const updated = bookmarks.filter((item) => item.url !== url);
        setBookmarks(updated);
        localStorage.setItem("bookmarks", JSON.stringify(updated));
    };

    const isBookmarked = (url) => {
        return bookmarks.some((item) => item.url === url);
    };

    return (
        <div className="p-4 max-w-7xl mx-auto bg-white text-black dark:bg-gray-900 dark:text-white">
            <div className="flex justify-between items-center mb-4">
                <h1
                    className="text-3xl font-bold cursor-pointer hover:underline"
                    onClick={handleTitleClick}
                >
                    DMU News
                </h1>
                <button
                    onClick={() => navigate("/bookmarks")}
                    className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                >
                    북마크 보기
                </button>
            </div>

            <p className="mb-4 text-gray-500 dark:text-gray-300">최신 해외 뉴스를 보여드립니다.</p>

            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="검색어 입력"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    검색
                </button>
            </form>

            <div className="flex flex-wrap gap-2 mb-4">
                {searchHistory.map((term, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                        <button
                            onClick={() => {
                                setInputValue(term);
                                setSearchTerm(term);
                            }}
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            {term}
                        </button>
                        <button
                            onClick={() => {
                                const updated = searchHistory.filter((t) => t !== term);
                                setSearchHistory(updated);
                                localStorage.setItem("searchHistory", JSON.stringify(updated));
                            }}
                            className="text-red-500 hover:text-red-700 text-xs"
                            title="삭제"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            selectedCategory === cat.value
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        } hover:bg-blue-100 dark:hover:bg-gray-700 transition`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                    <div key={index} className="relative">
                        <NewsCard article={article} index={index} />
                        <button
                            onClick={() =>
                                isBookmarked(article.url)
                                    ? removeBookmark(article.url)
                                    : addBookmark(article)
                            }
                            className={`absolute top-2 right-2 px-2 py-1 rounded text-sm shadow ${
                                isBookmarked(article.url)
                                    ? "bg-yellow-400 text-black"
                                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
                            }`}
                        >
                            {isBookmarked(article.url) ? "★" : "☆"}
                        </button>
                    </div>
                ))}
            </div>

            {articles.length === 0 && !isLoading && (
                <p className="text-center text-gray-500 mt-10">🔍 검색 결과가 없습니다.</p>
            )}

            <div
                ref={loaderRef}
                style={{ height: "30px" }}
                className="mt-6 text-center text-sm text-gray-400"
            >
                {isLoading
                    ? "뉴스 불러오는 중..."
                    : isEnd
                        ? "✅ 모든 뉴스를 다 봤어요 👀"
                        : "⬇ 더 많은 뉴스 보기"}
            </div>

            <footer className="text-center mt-12 text-sm text-gray-400">
                © 2025 DMU News. miniminimo_하은현_정용환
            </footer>
        </div>
    );
}

export default HomePage;
