import { useNavigate } from "react-router";

export function HeroVisualizerSection() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"></div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10 relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold mb-8 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          ✨ AI-Powered Career Command Center
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent max-w-5xl">
          Stop Getting Auto-Rejected.<br />
          <span className="text-primary">Fix Your Resume Now.</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed">
          ATS systems reject 75% of resumes before humans see them. 
          <span className="text-primary font-bold"> CVDebug shows you exactly what robots see</span> — and fixes it instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-20">
          <button 
            onClick={() => navigate("/auth")}
            className="flex items-center justify-center h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_-5px] shadow-primary/50"
          >
            <span className="mr-2 text-2xl">🎯</span>
            Start Free Analysis
          </button>
          <button 
            onClick={scrollToHowItWorks}
            className="flex items-center justify-center h-14 px-10 bg-card hover:bg-accent border-2 border-border hover:border-primary/50 text-foreground text-lg font-medium rounded-xl transition-all hover:scale-105"
          >
            <span className="mr-2 text-2xl">▶️</span>
            See How It Works
          </button>
        </div>

        {/* Split Screen Visualizer - Simplified */}
        <div className="relative w-full max-w-6xl aspect-[16/9] bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl flex group">
          {/* Human View */}
          <div className="flex-1 bg-background p-8 text-left border-r border-border relative">
            <div className="absolute top-4 right-4 bg-muted text-muted-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              👤 What You See
            </div>
            
            <div className="flex flex-col gap-4 opacity-50 blur-[0.5px] scale-95 origin-top-left select-none pointer-events-none">
              <div className="w-1/3 h-8 bg-foreground/20 rounded"></div>
              <div className="w-1/4 h-4 bg-foreground/10 rounded"></div>
              <div className="w-full h-[1px] bg-border my-2"></div>
              <div className="flex gap-4">
                <div className="w-1/4 h-32 bg-muted rounded"></div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="w-full h-3 bg-foreground/10 rounded"></div>
                  <div className="w-5/6 h-3 bg-foreground/10 rounded"></div>
                  <div className="w-4/6 h-3 bg-foreground/10 rounded"></div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center animate-pulse">
                <span className="text-4xl">⚠️</span>
              </div>
            </div>
          </div>

          {/* Robot View */}
          <div className="flex-1 bg-[#0a0a0a] p-8 text-left font-mono text-sm overflow-hidden relative">
            <div className="absolute top-4 right-4 bg-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-primary/30">
              🤖 What ATS Sees
            </div>
            
            <div className="flex flex-col gap-1 text-muted-foreground">
              <div className="flex gap-2">
                <span className="text-muted">01</span>
                <span className="text-purple-400">const</span> <span className="text-blue-400">resume</span> = parse(file);
              </div>
              <div className="flex gap-2">
                <span className="text-muted">02</span>
                <span className="text-muted-foreground">// Analyzing layout...</span>
              </div>
              <div className="flex gap-2 bg-destructive/10 -mx-8 px-8 py-1 border-l-2 border-destructive">
                <span className="text-muted">03</span>
                <span className="text-destructive">❌ ERROR: Column structure unreadable</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted">04</span>
                <span className="text-purple-400">if</span> (!keywords.includes(<span className="text-green-400">"Python"</span>)) {'{'}
              </div>
              <div className="flex gap-2 bg-destructive/10 -mx-8 px-8 py-1 border-l-2 border-destructive">
                <span className="text-muted">05</span>
                <span className="text-destructive">  status = "AUTO_REJECT";</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted">06</span>
                {'}'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}