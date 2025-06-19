import { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import { Link } from "react-router-dom";

function BookmarkPage() {
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("bookmarks");
        setBookmarks(saved ? JSON.parse(saved) : []);
    }, []);

    const removeBookmark = (url) => {
        const updated = bookmarks.filter((item) => item.url !== url);
        setBookmarks(updated);
        localStorage.setItem("bookmarks", JSON.stringify(updated));
    };

    return (
        <div className="p-4 max-w-7xl mx-auto bg-white text-black dark:bg-gray-900 dark:text-white">
            <div className="flex justify-between items-center mb-6 border-b pb-2 border-gray-300 dark:border-gray-700">
                <h1 className="text-2xl font-bold">📌 내 북마크 뉴스</h1>
                <Link
                    to="/"
                    className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    🏠 홈으로
                </Link>
            </div>

            {bookmarks.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">북마크된 뉴스가 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((article, index) => (
                        <div key={index} className="relative">
                            <NewsCard article={article} index={index} />
                            <button
                                onClick={() => removeBookmark(article.url)}
                                className="absolute top-2 right-2 px-2 py-1 rounded text-sm shadow bg-yellow-400 text-black"
                            >
                                ★
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookmarkPage;
