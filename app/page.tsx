"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ==========================================================
// 🔑 준수가 성공했던 Supabase 설정을 여기에 그대로 넣어줘!
// ==========================================================
const SUPABASE_URL = "https://whgycytlscawipelzhzj.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZ3ljeXRsc2Nhd2lwZWx6aHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTMzMjEsImV4cCI6MjA5NTYyOTMyMX0.hDFCRQUWWJpcG9BpOoa2g91_KRsyGa8hhLGpCK8D93A";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Question {
  id: number;
  department: string;
  category: string;
  content: string;
  likes_count: number;
  answers_count: number;
  created_at?: string;
}

interface Feedback {
  id: number;
  question_id: number;
  content: string;
  created_at: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "question" | "feedback" | "news">("home");
  const [dept, setDept] = useState("");
  const [topic, setTopic] = useState("진로");
  const [text, setText] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");

  // 📥 데이터 실시간 로드
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const { data: qData } = await supabase.from("questions").select("*").order("id", { ascending: false });
      if (qData) setQuestions(qData);

      const { data: fData } = await supabase.from("feedbacks").select("*").order("id", { ascending: false });
      if (fData) setFeedbacks(fData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 🚀 질문 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dept || !text) return;

    const { error } = await supabase.from("questions").insert([
      { department: dept, category: topic, content: text, likes_count: 0, answers_count: 0 }
    ]);

    if (!error) {
      alert(`🎉 익명 질문이 등록되었습니다!`);
      setText("");
      fetchInitialData();
      setActiveTab("home");
    }
  };

  // ✉️ 피드백 제출
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestionId || !feedbackText) return;

    const qId = parseInt(selectedQuestionId);
    const { error } = await supabase.from("feedbacks").insert([{ question_id: qId, content: feedbackText }]);

    if (!error) {
      const target = questions.find(q => q.id === qId);
      if (target) {
        await supabase.from("questions").update({ answers_count: (target.answers_count || 0) + 1 }).eq("id", qId);
      }
      alert("💡 선배의 피드백이 등록되었습니다!");
      setFeedbackText("");
      setSelectedQuestionId("");
      fetchInitialData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center font-sans p-4 antialiased">
      <div className="w-full max-w-md h-[840px] bg-white shadow-2xl rounded-[40px] overflow-hidden flex flex-col relative border-8 border-slate-900">
        
        {/* 상단 헤더 영역 */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 pt-8 pb-5 px-6 flex justify-between items-center shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white tracking-tight">ESSUE</span>
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">이쓔</span>
          </div>
          <span className="text-white/60 text-xs font-semibold">강남대 익명 커뮤니티</span>
        </header>

        {/* 메인 스크롤 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto pb-24 bg-slate-50/50 p-4 space-y-6">
          {loading ? (
            <div className="text-center py-20 text-xs font-bold text-slate-400 animate-pulse">
              🔄 실시간 데이터 동기화 중...
            </div>
          ) : (
            <>
              {/* 🏠 홈 탭 */}
              {activeTab === "home" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <span>🔥</span> 지금 뜨는 활성 질문
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {questions.map((q) => (
                        <div key={q.id} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-200">
                          <p className="text-sm font-bold text-slate-800 leading-snug mb-3">{q.content}</p>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <div className="flex gap-2 items-center">
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{q.department}</span>
                              <span className="text-[10px] font-medium text-slate-400">#{q.category}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">💬 {q.answers_count || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">📂 카테고리 탐색</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[{n:"진로", i:"💼"}, {n:"학점", i:"📊"}, {n:"기술", i:"🔍"}, {n:"생활", i:"🌱"}].map((c, idx) => (
                        <div key={idx} className="bg-white border border-slate-200/60 p-3 rounded-2xl text-center shadow-2xs hover:border-blue-500 cursor-pointer transition-all">
                          <div className="text-xl mb-1">{c.i}</div>
                          <span className="text-xs font-bold text-slate-700">{c.n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ❓ 질문하기 탭 */}
              {activeTab === "question" && (
                <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-sm space-y-4">
                  <h2 className="text-base font-black text-slate-800 flex items-center gap-2">✍️ 익명 질문 던지기</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 mb-1">질문할 전공 학과</label>
                      <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" required>
                        <option value="">[ 학과를 선택하세요 ]</option>
                        <option value="컴퓨터공학과">컴퓨터공학과</option>
                        <option value="AI학과">AI학과</option>
                        <option value="사회복지학과">사회복지학과</option>
                        <option value="경영학과">경영학과</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 mb-1">카테고리</label>
                      <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500">
                        <option value="진로">진로/취업</option>
                        <option value="학점">학점/수강</option>
                        <option value="기술">전공기술</option>
                        <option value="학교생활">학교생활 꿀팁</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 mb-1">질문 내용 (익명성 보장)</label>
                      <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="선배들에게 궁금한 점을 솔직하게 적어보세요..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium resize-none focus:outline-none focus:border-blue-500" required />
                    </div>
                    <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm rounded-xl shadow-md active:scale-98 transition-all">
                      선배들에게 질문 보내기 🚀
                    </button>
                  </form>
                </div>
              )}

              {/* 💬 피드백 답변 탭 */}
              {activeTab === "feedback" && (
                <div className="space-y-5">
                  <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-sm space-y-4">
                    <h2 className="text-base font-black text-slate-800">💡 선배 피드백 한마디</h2>
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div>
                        <select value={selectedQuestionId} onChange={(e) => setSelectedQuestionId(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500" required>
                          <option value="">[ 답변할 후배 질문 선택 ]</option>
                          {questions.map(q => (
                            <option key={q.id} value={q.id}>[{q.department}] {q.content.substring(0, 20)}...</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <textarea rows={4} value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="후배에게 피가 되고 살이 되는 조언을 남겨주세요." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium resize-none focus:outline-none focus:border-blue-500" required />
                      </div>
                      <button type="submit" className="w-full py-3 bg-slate-900 text-white font-black text-sm rounded-xl shadow-md active:scale-98 transition-all">
                        실시간 피드백 등록하기 ✉️
                      </button>
                    </form>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-500 uppercase">📩 멘토링 피드백 히스토리</h3>
                    {feedbacks.map((f) => {
                      const matchedQ = questions.find(q => q.id === f.question_id);
                      return (
                        <div key={f.id} className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-2xs space-y-3">
                          <div className="bg-slate-50 p-3 rounded-xl text-xs">
                            <span className="text-[10px] font-black text-blue-500 block mb-1">❓ 후배의 익명 질문</span>
                            <p className="font-bold text-slate-600">{matchedQ ? matchedQ.content : "삭제된 질문입니다."}</p>
                          </div>
                          <div className="flex gap-2 items-start pl-1">
                            <div className="text-indigo-600 font-bold text-xs mt-0.5">답변:</div>
                            <p className="text-xs text-slate-800 font-semibold leading-relaxed">{f.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 📰 뉴스 탭 */}
              {activeTab === "news" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-xs">
                    <div className="h-44 bg-slate-200 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <p className="text-white text-sm font-black">🔥 강남학보사 공식 인스타그램 연동 완료</p>
                      </div>
                    </div>
                    <div className="p-4 text-xs font-bold text-slate-500 leading-relaxed">
                      학교의 실시간 핵심 소식 및 학사 공지사항을 에브리타임보다 빠르게 정리해서 업로드합니다.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 하단 탭바 고정 영역 */}
        <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-t border-slate-100 px-6 flex justify-around items-center z-10 shrink-0">
          {[
            { id: "home", label: "홈", icon: "🏠" },
            { id: "question", label: "질문하기", icon: "❓" },
            { id: "feedback", label: "선배답변", icon: "💬" },
            { id: "news", label: "학보사", icon: "📰" }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? "text-blue-600 font-black scale-105" : "text-slate-400 font-medium"}`}>
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          ))}
        </nav>
        
      </div>
    </div>
  );
}