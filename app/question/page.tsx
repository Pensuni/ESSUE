```tsx
'client'

import { useState } from 'react'

export default function QuestionPage() {
  const [department, setDepartment] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 여기에 나중에 Supabase로 데이터 보내는 코드가 들어갈 거야!
    alert(`질문 제출 완료!\n학과: ${department}\n카테고리: ${category}\n내용: ${content}`)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-xl font-bold mb-6 text-center">익명 질문 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 학과 선택 */}
        <div>
          <label className="block text-sm font-medium mb-1">학과 선택</label>
          <select 
            className="w-full p-2 border rounded"
            value={department} 
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">-- 학과를 선택하세요 --</option>
            <option value="컴퓨터공학과">컴퓨터공학과</option>
            <option value="시각디자인학과">시각디자인학과</option>
          </select>
        </div>

        {/* 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium mb-1">주제 선택</label>
          <div className="flex gap-2">
            {['진로', '학점', '꿀강'].map((item) => (
              <button
                key={item}
                type="button"
                className={`px-4 py-2 border rounded ${category === item ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 질문 내용 */}
        <div>
          <label className="block text-sm font-medium mb-1">질문 내용</label>
          <textarea
            className="w-full p-2 border rounded h-32"
            placeholder="커뮤니티의 거친 반응 걱정 없이 편하게 질문하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-bold">
          제출하기
        </button>
      </form>
    </div>
  )
}