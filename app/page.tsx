"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function Home() {
  // 하단 탭 상태 관리: 'home' | 'question' | 'feedback' | 'news'
  const [activeTab, setActiveTab] = useState<"home" | "question" | "feedback" | "news">("home");
  
  // 익명 질문 폼 상태 관리
  const [dept, setDept] = useState("");
  const [topic, setTopic] = useState("진로");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`[${dept} / ${topic}] 질문이 등록되어 지정 선배에게 SMS가 발송되었습니다!`);
    setText("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center font-sans">
      {/* 모바일 프레임처럼 보이도록 감싸는 기기 컨테이너 */}
      <div className="w-full max-w-md h-[840px] bg-white shadow-2xl rounded-[40px] overflow-hidden flex flex-col relative border-8 border-slate-800">
        
        {/* 상단 상태바 스타일 헤더 */}
        <header className="bg-white pt-6 pb-3 px-6 border-b border-pink-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-pink-500 tracking-wider">ESSUE</span>
            <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full">이쓔</span>
          </div>
          <div className="text-gray-400 hover:text-pink-500 cursor-pointer">
            🔍
          </div>
        </header>

        {/* 메인 스크롤 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto pb-24 bg-pink-50/30">
          
          {/* 1. 홈 탭 (서비스 메인) */}
          {activeTab === "home" && (
            <div className="p-5 space-y-6 animate-fadeIn">
              {/* 활성 질문 섹션 */}
              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3">🔥 활성 질문</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex flex-col justify-between h-28">
                    <p className="text-sm font-semibold text-gray-700 line-clamp-2">전공 선택 고민인데 컴공이랑 AI학과 중 어디가...</p>
                    <span className="text-[11px] font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-md self-start">#진로</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex flex-col justify-between h-28">
                    <p className="text-sm font-semibold text-gray-700 line-clamp-2">강남학사 주변에 가성비 좋은 자취방 추천해주세요!</p>
                    <span className="text-[11px] font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-md self-start">#지역</span>
                  </div>
                </div>
              </section>

              {/* 내 피드백 보관함 섹션 */}
              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3">📥 내 피드백 보관함</h3>
                <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg">✉️</div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-400">받은 편지함</h4>
                    <p className="text-sm font-bold text-gray-700 line-clamp-1">선배님이 익명 질문에 피드백을 남겼습니다.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("feedback")} 
                    className="text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 px-3 py-2 rounded-xl transition-all"
                  >
                    보기
                  </button>
                </div>
              </section>

              {/* 카테고리 탐색 섹션 */}
              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3">📂 카테고리 탐색</h3>
                <div className="grid grid-cols-4 gap-2">
                  {["Career", "Credits", "Category", "Life"].map((cat, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 p-3 rounded-xl shadow-xs text-center cursor-pointer hover:border-pink-300">
                      <div className="text-lg mb-1">📁</div>
                      <span className="text-xs font-bold text-gray-600">{cat}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 캠퍼스 뉴스 섹션 */}
              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3">📰 캠퍼스 뉴스</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs">
                    <div className="h-24 bg-pink-200 flex items-center justify-center text-xs font-bold text-pink-700">강남학보사 이미지</div>
                    <div className="p-3"><p className="text-xs font-bold text-gray-700 line-clamp-1">[공지] 신입생 OT 일정 안내</p></div>
                  </div>
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs">
                    <div className="h-24 bg-pink-300 flex items-center justify-center text-xs font-bold text-pink-700">강남학보사 이미지</div>
                    <div className="p-3"><p className="text-xs font-bold text-gray-700 line-clamp-1">이번 학기 축제 라인업 공개!</p></div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* 2. 익명 질문 제출 탭 */}
          {activeTab === "question" && (
            <div className="p-5 space-y-5 animate-fadeIn">
              <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-md">
                <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">✍️ 익명 질문 제출</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">학과 선택</label>
                    <select 
                      value={dept} 
                      onChange={(e) => setDept(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
                      required
                    >
                      <option value="">[학과를 선택하세요]</option>
                      <option value="컴퓨터공학과">컴퓨터공학과</option>
                      <option value="AI학과">AI학과</option>
                      <option value="경영학과">경영학과</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">주제 선택</label>
                    <div className="flex flex-wrap gap-2">
                      {["진로", "학점", "지역", "학과", "기술"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                            topic === t ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">질문 내용</label>
                    <textarea
                      rows={5}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="익명으로 게시될 질문을 입력하세요. 연동된 선배에게 실시간으로 문자가 전송됩니다."
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="anon" defaultChecked className="accent-pink-500" />
                    <label htmlFor="anon" className="text-xs font-bold text-gray-500">익명 게시 동의</label>
                  </div>

                  <button type="submit" className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-black text-sm rounded-xl shadow-md transition-colors">
                    제출하기
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 3. 선배 실시간 알림 / 피드백 탭 */}
          {activeTab === "feedback" && (
            <div className="p-5 space-y-4 animate-fadeIn">
              <h2 className="text-lg font-black text-gray-800 mb-1">📩 선배 실시간 알림</h2>
              <p className="text-xs text-gray-400 mb-4">선배님들이 보낸 따끈따끈한 멘토링 피드백입니다.</p>

              {[
                { q: "컴공 졸업 요건이 어떻게 되나요?", a: "기본 140학점에 캡스톤 디자인 통과 필수입니다! 힘내세요 ㅎㅎ" },
                { q: "장학금 신청 기간 놓쳤는데 추가 접수 받나요?", a: "보통 학생과에 직접 전화해서 사유서 내면 구제해 주는 경우가 있으니 내일 아침 일찍 전화해 보세요!" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm space-y-3">
                  <div className="bg-pink-50/50 p-3 rounded-xl border border-dashed border-pink-200">
                    <span className="text-[10px] font-black text-pink-400 uppercase">My Question</span>
                    <p className="text-xs font-bold text-gray-600 mt-0.5">❓ {item.q}</p>
                  </div>
                  <div className="flex gap-2 items-start pl-1">
                    <div className="text-base mt-0.5">💬</div>
                    <div>
                      <span className="text-xs font-black text-gray-700">선배의 피드백</span>
                      <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-pink-500 hover:underline cursor-pointer pt-1 flex items-center gap-1">
                    <span>[피드백 링크 보기]</span> 🔗
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. 강남학보사 뉴스 통합 탭 */}
          {activeTab === "news" && (
            <div className="p-5 space-y-5 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black text-gray-800">🗞️ 강남학보사 뉴스</h2>
                  <p className="text-xs text-gray-400">인스타그램 피드 연동 및 통합 공지사항</p>
                </div>
                <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-md font-bold">@instagram</span>
              </div>

              {/* 인스타 피드 카드 1 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="p-3 flex items-center gap-2 border-b border-gray-50">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 p-0.5">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px]">📰</div>
                  </div>
                  <span className="text-xs font-black text-gray-700">gangnam_newspaper</span>
                </div>
                <div className="h-56 bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500">
                  [ 인스타그램 뉴스 카드뉴스 이미지 ]
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-black text-gray-800 mr-2">gangnam_newspaper</span>
                    2026학년도 대동제 부스 및 축제 주간 일정 안내 카드뉴스입니다! 학우 여러분의 많은 관심 부탁드립니다...
                  </p>
                  <span className="text-[10px] text-gray-400 font-medium block">1일 전</span>
                </div>
              </div>

              {/* 공지사항 리스트 */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <h4 className="text-xs font-black text-gray-400 mb-2">📌 학보사 주요 공지사항</h4>
                <ul className="divide-y divide-gray-100 text-xs text-gray-600 font-semibold">
                  <li className="py-2 hover:text-pink-500 cursor-pointer flex justify-between"><span>• 수강신청 정정 기간 및 학점 포기 안내</span><span className="text-gray-400 font-normal">05.28</span></li>
                  <li className="py-2 hover:text-pink-500 cursor-pointer flex justify-between"><span>• 강남학사 도서관 야간 개방 시간 연장 안내</span><span className="text-gray-400 font-normal">05.24</span></li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* 하단 고정 탭 바 내비게이션 (와이어프레임 구조 구현) */}
        <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-pink-100 px-4 flex justify-around items-center z-10">
          <button 
            onClick={() => setActiveTab("home")} 
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "home" ? "text-pink-500 scale-105" : "text-gray-400"}`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-black">홈</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("question")} 
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "question" ? "text-pink-500 scale-105" : "text-gray-400"}`}
          >
            <span className="text-xl">❓</span>
            <span className="text-[10px] font-black">질문</span>
          </button>

          <button 
            onClick={() => setActiveTab("feedback")} 
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "feedback" ? "text-pink-500 scale-105" : "text-gray-400"}`}
          >
            <span className="text-xl">💬</span>
            <span className="text-[10px] font-black">피드백</span>
          </button>

          <button 
            onClick={() => setActiveTab("news")} 
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "news" ? "text-pink-500 scale-105" : "text-gray-400"}`}
          >
            <span className="text-xl">📰</span>
            <span className="text-[10px] font-black">뉴스</span>
          </button>
        </nav>

      </div>
    </div>
  );
}