import { Link } from "react-router-dom";

function NewsCard({ article, index }) {
    // 이미지 URL 보정: http → https 변환 함수
    const secureImage = (url) => {
        if (!url) return null; // URL이 없으면 null 반환
        return url.startsWith("http://") ? url.replace("http://", "https://") : url;
    };

    // 사용할 기본 이미지 URL을 여기에 정의하세요.
    // 예: 'https://via.placeholder.com/400x200?text=No+Image' 또는 사용자 정의 이미지 URL
    const DEFAULT_IMAGE_URL = "https://placehold.co/400x200?text=No+Image+Available";
    // 기본 이미지의 크기와 텍스트를 조절하여 사용하세요.

    // 1. article.urlToImage에 secureImage 함수를 적용합니다.
    // 2. 결과가 없으면 DEFAULT_IMAGE_URL을 사용합니다.
    const finalImageUrl = secureImage(article.urlToImage) || DEFAULT_IMAGE_URL;

    return (
        <Link to={`/article/${index}`} className="block">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <img
                    // 최종 이미지 URL을 사용합니다. 이미지가 없거나 http일 경우 처리됨.
                    src={finalImageUrl}
                    alt={article.title || "뉴스 썸네일"} // alt 텍스트도 설정하여 접근성 높임
                    onError={(e) => {
                        // 이미지 로드 실패 시 (네트워크 오류, 잘못된 URL 등),
                        // 기본 이미지로 대체합니다.
                        e.target.onerror = null; // 무한 루프 방지
                        e.target.src = DEFAULT_IMAGE_URL;
                    }}
                    className="w-full h-48 object-cover" // 이미지가 카드에 맞춰 잘 보이도록 스타일 추가
                />
                <div className="p-4 flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
                    {/* 설명이 너무 길면 잘리도록 truncate 클래스 등을 추가할 수 있습니다. */}
                    <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm line-clamp-3"> 
                        {article.description || "기사 내용 요약이 없습니다."}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto">
                        {article.source?.name || "알 수 없음"} ・{" "}
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default NewsCard;