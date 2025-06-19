import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import BookmarkPage from "./pages/BookmarkPage";
import { useState, useEffect } from "react";

function App() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    }, [isDark]);

    return (
        <Router>
            <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
                <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    {/* ✅ 제목 클릭 시 홈으로 이동 */}
                    <Link to="/" className="text-xl font-bold hover:underline">
                        DMU News
                    </Link>

                    <div className="flex items-center gap-2">

                        {/* ✅ 다크모드 토글 */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="text-sm px-3 py-1 rounded-full border dark:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {isDark ? "☀️ Light" : "🌙 Dark"}
                        </button>
                    </div>
                </header>

                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/article/:index" element={<ArticlePage />} />
                        <Route path="/bookmarks" element={<BookmarkPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
