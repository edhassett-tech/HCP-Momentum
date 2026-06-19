export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Phone chrome */}
      <div className="w-full max-w-[420px] min-h-[700px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Status bar notch */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-24 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* App content */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
            Momentum
          </h1>
        </div>
      </div>
    </div>
  );
}
