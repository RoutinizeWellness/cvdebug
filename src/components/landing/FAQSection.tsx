export function FAQSection() {
  return (
    <section className="w-full py-24 bg-[#050505] border-t border-white/10" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Common Queries</h2>
        
        <div className="space-y-4">
          {/* FAQ Item 1 */}
          <details className="group bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden transition-all duration-300 open:border-[#7c3bed]/50">
            <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
              <h3 className="text-base font-medium text-white group-hover:text-[#7c3bed] transition-colors">Do you sell my data?</h3>
              <span className="transform group-open:rotate-180 transition-transform text-xl">👇</span>
            </summary>
            <div className="px-6 pb-6 pt-0 text-gray-400 text-sm leading-relaxed">
              Never. Your resume is parsed in memory and stored securely only for your session. We do not sell data to recruiters or third parties.
            </div>
          </details>

          {/* FAQ Item 2 */}
          <details className="group bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden transition-all duration-300 open:border-[#7c3bed]/50">
            <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
              <h3 className="text-base font-medium text-white group-hover:text-[#7c3bed] transition-colors">What is the "Image Trap"?</h3>
              <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform text-gray-400">expand_more</span>
            </summary>
            <div className="px-6 pb-6 pt-0 text-gray-400 text-sm leading-relaxed">
              Many modern resume templates (from Canva or Photoshop) export text as flattened images or complex vector shapes. While they look good to humans, ATS robots see blank pages. Our tool detects this instantly.
            </div>
          </details>

          {/* FAQ Item 3 */}
          <details className="group bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden transition-all duration-300 open:border-[#7c3bed]/50">
            <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
              <h3 className="text-base font-medium text-white group-hover:text-[#7c3bed] transition-colors">Does this work for all industries?</h3>
              <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform text-gray-400">expand_more</span>
            </summary>
            <div className="px-6 pb-6 pt-0 text-gray-400 text-sm leading-relaxed">
              Yes, but it is optimized for technical and corporate roles where ATS usage is heaviest (Tech, Finance, Healthcare, Engineering).
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
