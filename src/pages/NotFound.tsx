import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background"
    >
      {/* Header with Logo */}
      <div className="container mx-auto px-6 py-6">
        <div className="cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate("/")}>
          <Logo />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto relative px-4">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center space-y-6">
              <h1 className="text-6xl md:text-8xl font-black text-foreground">404</h1>
              <p className="text-xl md:text-2xl text-muted-foreground">Page Not Found</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Button 
                onClick={() => navigate("/")} 
                className="mt-6 rounded-full px-8 shadow-lg shadow-primary/20 font-bold"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}