import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Check, Image as ImageIcon, Search, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">Screenshot Organizer</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
          <Button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-6 py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary">
              Organize your chaos.
              <br />
              <span className="text-muted-foreground">Instantly.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stop searching through thousands of "Screenshot 2024...". 
              We use AI to extract text, categorize, and make every screenshot searchable.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" className="h-12 px-8 text-base" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                Start Organizing Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="bg-secondary/30 py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <Feature 
                icon={<Zap className="h-6 w-6" />}
                title="Instant OCR"
                description="Text is automatically extracted from every screenshot you upload, making it instantly searchable."
              />
              <Feature 
                icon={<Search className="h-6 w-6" />}
                title="Smart Search"
                description="Find that one receipt or code snippet from months ago just by typing what was in it."
              />
              <Feature 
                icon={<Check className="h-6 w-6" />}
                title="Auto Categorization"
                description="Screenshots are automatically tagged and organized into relevant categories."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 Screenshot Organizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="space-y-4">
      <div className="h-12 w-12 bg-background border rounded-xl flex items-center justify-center text-primary shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}