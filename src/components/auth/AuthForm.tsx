import { SignIn, SignUp } from "@clerk/clerk-react";
import { Logo } from "@/components/Logo";

interface AuthFormProps {
  isSignIn: boolean;
  setIsSignIn: (val: boolean) => void;
  redirectUrl: string;
  clerkAppearance: any;
}

export function AuthForm({ isSignIn, setIsSignIn, redirectUrl, clerkAppearance }: AuthFormProps) {
  return (
    <div className="relative z-10 w-full max-w-md m-auto p-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 p-8">
        <div className="flex justify-center mb-8">
          <Logo className="h-10 w-auto" />
        </div>

        <div className="mb-6 flex p-1 bg-slate-100/80 rounded-lg relative">
          <div 
            className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-all duration-300 ease-out ${isSignIn ? 'left-1' : 'left-[calc(50%+0px)]'}`}
          />
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-200 ${isSignIn ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-200 ${!isSignIn ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign Up
          </button>
        </div>

        <div className="min-h-[400px]">
          {isSignIn ? (
            <SignIn 
              appearance={clerkAppearance} 
              fallbackRedirectUrl={redirectUrl}
              signUpUrl="/auth?mode=signup"
            />
          ) : (
            <SignUp 
              appearance={clerkAppearance} 
              fallbackRedirectUrl={redirectUrl}
              signInUrl="/auth?mode=signin"
            />
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
