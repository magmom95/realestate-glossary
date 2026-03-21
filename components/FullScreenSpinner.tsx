'use client';

export default function FullScreenSpinner({ message = '전송 중…' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[600] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
      <span className="w-10 h-10 border-[3px] border-white/20 border-t-[#e8c97d] rounded-full animate-spin mb-4" />
      <p className="text-sm text-[#8a8276] font-medium">{message}</p>
    </div>
  );
}
