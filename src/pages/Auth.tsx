import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50"></div>
      
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-6 scale-150">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isSignIn ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSignIn ? "Enter your credentials to access your dashboard" : "Start optimizing your resume today"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-xl p-6">
          {isSignIn ? (
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none w-full bg-transparent p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  header: "hidden",
                  footer: "hidden",
                  footerAction: "hidden",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20",
                }
              }}
            />
          ) : (
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none w-full bg-transparent p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  header: "hidden",
                  footer: "hidden",
                  footerAction: "hidden",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20",
                }
              }}
            />
          )}
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-bold text-primary hover:underline"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}