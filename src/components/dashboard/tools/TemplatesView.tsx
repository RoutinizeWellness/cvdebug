import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutTemplate, Lock } from "lucide-react";

export function TemplatesView() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-foreground">Resume Templates</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          ATS-friendly templates designed to get you hired. Clean code, no tables, and optimized for parsing.
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden shadow-lg min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm z-10">
          COMING SOON
        </div>
        
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <LayoutTemplate className="h-10 w-10 text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold mb-2">Premium ATS Templates</h3>
        <p className="text-muted-foreground max-w-md mb-8">
          We are crafting a collection of high-performance, ATS-verified resume templates. 
          These will be optimized for specific industries like Tech, Finance, and Creative.
        </p>
        
        <Button size="lg" disabled className="font-bold h-12 px-8 shadow-xl">
          <Lock className="mr-2 h-4 w-4" /> Join Waitlist for Access
        </Button>
      </Card>
    </div>
  );
}
