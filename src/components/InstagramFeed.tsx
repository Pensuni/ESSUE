import React from 'react';

// 학보사 피드 데이터 구조 정의
interface NewsPost {
  id: string;
  imageUrl: string;
  title: string;
  date: string;
  likes: number;
  link: string;
}

// 임시 데이터 (나중에 Supabase에 넣어서 불러올 수 있습니다)
const mockNewsData: NewsPost[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=500', // 대학교 임시 이미지
    title: '[축제 공지] 2026 대동제 라인업 및 일정 대공개! 🎉',
    date: '2026-06-01',
    likes: 124,
    link: 'https://instagram.com'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=500',
    title: '[학사] 1학기 기말고사 강의평가 및 성적 열람 기간 안내',
    date: '2026-05-28',
    likes: 89,
    link: 'https://instagram.com'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=500',
    title: '[취업] 2026 상반기 캠퍼스 리크루팅 참여 기업 모집',
    date: '2026-05-25',
    likes: 56,
    link: 'https://instagram.com'
  }
];

export default function InstagramFeed() {
  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      {/* 상단 학보사 프로필 영역 */}
      <div className="flex items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-full p-[2px]">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-xs text-gray-800">
            학보
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-bold text-gray-900">강남학보사</p>
          <p className="text-xs text-gray-500">@kangnam_news</p>
        </div>
      </div>

      {/* 캠퍼스 뉴스 피드 그리드 레이아웃 (와이어프레임 반영) */}
      <div className="grid grid-cols-1 gap-4 p-4">
        {mockNewsData.map((post) => (
          <a 
            key={post.id} 
            href={post.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 block transition hover:scale-[1.01]"
          >
            {/* 카드뉴스 이미지 */}
            <div className="aspect-square relative w-full bg-gray-200">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 하단 텍스트 및 인터랙션 영역 */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-red-500 text-sm font-semibold">
                  <span>❤️ {post.likes}</span>
                </div>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                {post.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}