// src/components/Header.tsx
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex items-center p-4 border-b border-gray-200 bg-white">
      {/* 우리가 옮긴 로고를 불러와 */}
      <div className="w-10 h-10">
        <Image 
          src="/logo.png" 
          alt="ESSUE Logo" 
          width={40} 
          height={40} 
        />
      </div>
      <h1 className="ml-3 text-lg font-bold text-gray-800">ESSUE</h1>
    </header>
  );
}