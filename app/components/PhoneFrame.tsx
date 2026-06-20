export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] h-[812px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-24 h-1.5 bg-slate-200 rounded-full" />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
