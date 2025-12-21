import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export function HeroVisualizerSection() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-20 pb-32 overflow-hidden bg-white">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Badge */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered ATS Optimization
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-gray-900">
            Stop Getting Auto-Rejected.<br />
            <span className="text-primary">Fix Your Resume Now.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            ATS systems reject <span className="font-bold text-gray-900">75% of resumes</span> before humans see them. 
            CVDebug shows you exactly what robots see — and fixes it instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              onClick={() => navigate("/auth")}
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-primary/25"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(163, 127, 188, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              Start Free Analysis →
            </motion.button>
            <motion.button 
              onClick={scrollToHowItWorks}
              className="px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary/30 text-gray-900 text-lg font-semibold rounded-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              See How It Works
            </motion.button>
          </div>
        </motion.div>

        {/* Split Screen Visualizer */}
        <motion.div 
          className="relative w-full max-w-6xl mx-auto aspect-[16/9] bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="flex h-full">
            {/* Human View */}
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white p-8 text-left border-r border-gray-200 relative">
              <div className="absolute top-4 right-4 bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                👤 What You See
              </div>
              
              <div className="flex flex-col gap-4 opacity-60 blur-[0.3px] scale-95 origin-top-left select-none pointer-events-none">
                <div className="w-1/3 h-8 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-[1px] bg-gray-200 my-2"></div>
                <div className="flex gap-4">
                  <div className="w-1/4 h-32 bg-gray-200 rounded"></div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="w-full h-3 bg-gray-200 rounded"></div>
                    <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
                    <div className="w-4/6 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="size-20 rounded-full bg-red-100 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-4xl">⚠️</span>
                </motion.div>
              </div>
            </div>

            {/* Robot View */}
            <div className="flex-1 bg-[#0a0a0a] p-8 text-left font-mono text-sm overflow-hidden relative">
              <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-red-500/30">
                🤖 What ATS Sees
              </div>
              
              <div className="flex flex-col gap-1 text-gray-400">
                <div className="flex gap-2">
                  <span className="text-gray-600">01</span>
                  <span className="text-purple-400">const</span> <span className="text-blue-400">resume</span> = parse(file);
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">02</span>
                  <span className="text-gray-500">// Analyzing layout...</span>
                </div>
                <div className="flex gap-2 bg-red-500/10 -mx-8 px-8 py-1 border-l-2 border-red-500">
                  <span className="text-gray-600">03</span>
                  <span className="text-red-400">❌ ERROR: Column structure unreadable</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">04</span>
                  <span className="text-purple-400">if</span> (!keywords.includes(<span className="text-green-400">"Python"</span>)) {'{'}
                </div>
                <div className="flex gap-2 bg-red-500/10 -mx-8 px-8 py-1 border-l-2 border-red-500">
                  <span className="text-gray-600">05</span>
                  <span className="text-red-400">  status = "AUTO_REJECT";</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">06</span>
                  {'}'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}