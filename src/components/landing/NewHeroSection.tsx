import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export function NewHeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative isolate overflow-hidden px-6 pt-14 lg:px-8">
      {/* Background effects */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></motion.div>
      </div>

      <div className="mx-auto max-w-4xl py-12 sm:py-20 lg:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium leading-6 text-primary ring-1 ring-inset ring-primary/20 backdrop-blur-sm">
            New: ATS 2.0 Parser Support{" "}
            <span className="text-slate-400 mx-1">|</span>{" "}
            <a
              href="#changelog"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Read changelog <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Stop being invisible to <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            hiring bots.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto"
        >
          The standard PDF you're sending is unreadable to 70% of ATS systems.
          See what the bot sees in 10 seconds and fix your parse rate.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            className="glow-button relative flex h-12 min-w-[200px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-blue-600 px-8 text-base font-bold text-white transition-all hover:bg-blue-600"
          >
            Scan My Resume Now
          </Button>
          <button
            onClick={() => {
              const element = document.getElementById("how-it-works");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group text-sm font-semibold leading-6 text-white hover:text-primary transition-colors"
          >
            See how it works{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
