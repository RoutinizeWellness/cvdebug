export function AuthVisuals() {
  return (
    <>
      {/* Enhanced background ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-secondary/15 via-teal-500/10 to-transparent rounded-full blur-[140px] translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-gradient-to-br from-primary/10 via-blue-500/8 to-transparent rounded-full blur-[120px] -translate-y-1/4 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/5 to-pink-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Subtle noise texture overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </>
  );
}
