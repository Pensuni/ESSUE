'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화 (환경 변수 사용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'ask' | 'feedback' | 'news'>('home');
  const [category, setCategory] = useState<string>('전체');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 폼 상태 관리
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [content, setContent] = useState('');

  // 1. Supabase에서 질문 목록 실시간으로 불러오기
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      let query = supabase.from('essue_posts').select('*').order('created_at', { ascending: false });
      
      if (category !== '전체') {
        query = query.eq('topic', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('데이터 조회 에-러:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supabaseUrl && supabaseAnonKey) {
      fetchQuestions();
    }
  }, [category]);

  // 2. 익명 질문 등록 기능 (Supabase Insert)
  const handleInsertQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !selectedTopic || !content.trim()) {
      alert('모든 항목을 입력해 주세요!');
      return;
    }

    try {
      const { error } = await supabase.from('essue_posts').insert([
        { department: selectedDept, topic: selectedTopic, content: content }
      ]);

      if (error) throw error;

      alert('익명 질문이 성공적으로 등록되었습니다. 선배 알림이 전송됩니다!');
      setSelectedDept('');
      setSelectedTopic('');
      setContent('');
      setActiveTab('home'); // 성공 후 메인 피드로 이동
      fetchQuestions();
    } catch (err) {
      alert('등록에 실패했습니다. DB 연결을 확인해 주세요.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-0 md:p-4 text-slate-800">
      {/* 모바일 뷰포트 고정 컨테이너 (와이어프레임 스마트폰 규격 반영) */}
      <div className="w-full max-w-md h-[840px] bg-white rounded-none md:rounded-3xl shadow-xl flex flex-col relative overflow-hidden border border-slate-200">
        
        {/* 상단바 Area */}
        <header className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            ESSUE
          </h1>
          <span className="text-xs bg-rose-50 text-rose-500 font-bold px-2.5 py-1 rounded-full border border-rose-100">
            강남대 익명 커뮤니티
          </span>
        </header>

        {/* 메인 콘텐츠 스크롤 영역 */}
        <main className="flex-1 overflow-y-auto px-5 py-4 pb-24">
          
          {/* TAP 1: 서비스 메인 (홈) */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* 카테고리 필터 (와이어프레임 구조) */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">🔍 카테고리 탐색</h3>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {['전체', '진로', '학점', '꿀강', '학교생활'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setCategory(item)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        category === item
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* 활성 질문 목록 영역 (지식 공유 아카이브) */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                    🔥 활성 질문 <span className="text-sm font-medium text-slate-400">({questions.length})</span>
                  </h2>
                </div>

                {loading ? (
                  <div className="py-10 text-center text-sm text-slate-400 font-medium animate-pulse">
                    질문을 불러오는 중...
                  </div>
                ) : questions.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center text-sm text-slate-400">
                    등록된 익명 질문이 없습니다.<br />첫 질문의 주인공이 되어보세요!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questions.map((q) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-rose-200 transition-all">
                        <div className="flex gap-2 mb-2">
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{q.department}</span>
                          <span className="text-[10px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded-md font-bold">{q.topic}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed mb-3">{q.content}</p>
                        <div className="flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-50 pt-2.5">
                          <span>조회수 1 · 답변 대기중</span>
                          <span className="text-rose-400 font-semibold cursor-pointer hover:underline">피드백 남기기 →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAP 2: 익명 질문 제출 */}
          {activeTab === 'ask' && (
            <div className="space-y-4">
              <div className="bg-rose-50/50 border border-rose-100/60 p-4 rounded-2xl mb-2">
                <h2 className="text-sm font-bold text-rose-600 mb-1">📝 자유롭고 안전한 소통 공간</h2>
                <p className="text-xs text-rose-500/90 leading-relaxed">회원가입 없이 학과와 주제를 고르고 익명으로 질문을 등록하세요. 질문이 등록되면 해당 전공 선배에게 실시간 문자 알림이 전송됩니다!</p>
              </div>

              <form onSubmit={handleInsertQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">학과 선택</label>
                  <select 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-rose-400 focus:bg-white transition-all"
                  >
                    <option value="">[학과를 선택하세요]</option>
                    <option value="컴퓨터공학부">컴퓨터공학부</option>
                    <option value="사회복지학부">사회복지학부</option>
                    <option value="글로벌경영학부">글로벌경영학부</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">주제 선택</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['진로', '학점', '꿀강', '학교생활'].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setSelectedTopic(t)}
                        className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                          selectedTopic === t
                            ? 'bg-rose-500 border-rose-500 text-white font-bold shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">질문 내용 입력</label>
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="커뮤니티의 거친 반응 걱정 없이, 선배에게 물어보고 싶은 내용을 자유롭게 작성해 보세요."
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-rose-400 focus:bg-white resize-none placeholder:text-slate-300 leading-relaxed transition-all"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white text-sm font-bold py-3 rounded-2xl hover:bg-rose-600 shadow-md hover:shadow-lg transition-all"
                >
                  🚀 익명 질문 제출하기
                </button>
              </form>
            </div>
          )}

          {/* TAP 3: 선배 실시간 알림 및 피드백 구조 */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 mb-1">📩 선배 수신 받은 편지함 (가상 플로우)</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">질문이 등록되었을 때 지정 선배에게 매칭되는 SMS 가상 수신함 레이아웃입니다.</p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500">📥 선배 실시간 매칭 알림</span>
                    <span className="text-[10px] text-rose-500 bg-white font-bold px-2 py-0.5 rounded-full shadow-sm border border-rose-100">SMS 발송 완료</span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono bg-white p-3 rounded-xl border border-slate-200/60 mb-2.5 leading-relaxed">
                    [ESSUE] 후배가 컴퓨터공학부 [학점] 관련 익명 질문을 등록했습니다! 피드백을 남겨주세요.<br />
                    👉 <span className="text-blue-500 underline cursor-pointer">essue.vercel.app/feedback/link-id</span>
                  </p>
                  <button className="w-full bg-white text-slate-700 border border-slate-200 text-xs font-bold py-2 rounded-xl hover:bg-slate-50 transition-all">
                    내 피드백 보관함 보기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAP 4: 강남학보사 소식 연동 */}
          {activeTab === 'news' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  📸
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800">@kangnam_news</h2>
                  <p className="text-[11px] text-slate-400 font-medium">강남학보사 공식 인스타그램 API 연동</p>
                </div>
              </div>

              {/* 가상 카드뉴스 피드 아카이브 (와이어프레임 완벽 대응) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-100 aspect-square rounded-2xl p-4 flex flex-col justify-between border border-slate-200/40 relative overflow-hidden group cursor-pointer shadow-sm">
                  <span className="text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-md font-bold w-max z-10">최신 뉴스</span>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed z-10">2026학년도<br />신입생 오티 안내 카드뉴스</p>
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-100/60 to-transparent opacity-60"></div>
                </div>
                <div className="bg-slate-100 aspect-square rounded-2xl p-4 flex flex-col justify-between border border-slate-200/40 relative overflow-hidden group cursor-pointer shadow-sm">
                  <span className="text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-md font-bold w-max z-10">공지사항</span>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed z-10">1학기 수강신청 변경 및 포기 기간 안내</p>
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-100/60 to-transparent opacity-60"></div>
                </div>
              </div>
              <p className="text-center text-[11px] text-slate-400 py-2">흩어져 있는 학교 소식을 통합 아카이빙하는 영역입니다.</p>
            </div>
          )}

        </main>

        {/* 하단 고정 내비게이션 바 (와이어프레임 스마트폰 버튼 구조 완벽 일치) */}
        <nav className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-slate-100 flex justify-around items-center z-10 px-2">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${activeTab === 'home' ? 'text-rose-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-[10px] mt-0.5">홈</span>
          </button>
          <button 
            onClick={() => setActiveTab('ask')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${activeTab === 'ask' ? 'text-rose-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="text-lg">❓</span>
            <span className="text-[10px] mt-0.5">질문</span>
          </button>
          <button 
            onClick={() => setActiveTab('feedback')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${activeTab === 'feedback' ? 'text-rose-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="text-lg">💬</span>
            <span className="text-[10px] mt-0.5">피드백</span>
          </button>
          <button 
            onClick={() => setActiveTab('news')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${activeTab === 'news' ? 'text-rose-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="text-lg">📰</span>
            <span className="text-[10px] mt-0.5">뉴스</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
