import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, PlusCircle } from "lucide-react";

interface AdminManualGrantProps {
  grantEmail: string;
  setGrantEmail: (value: string) => void;
  grantName: string;
  setGrantName: (value: string) => void;
  grantPlan: "single_debug_fix" | "single_scan" | "interview_sprint";
  setGrantPlan: (value: "single_debug_fix" | "single_scan" | "interview_sprint") => void;
  handleGrantPurchase: () => void;
  isGranting: boolean;
}

export function AdminManualGrant({
  grantEmail,
  setGrantEmail,
  grantName,
  setGrantName,
  grantPlan,
  setGrantPlan,
  handleGrantPurchase,
  isGranting
}: AdminManualGrantProps) {
  return (
    <Card className="mb-8 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-primary" />
          Manual Purchase Grant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="grant-email">User Email or ID (Clerk ID)</Label>
            <Input 
              id="grant-email" 
              placeholder="user@example.com or user_2..." 
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
            />
          </div>
          <div className="grid w-full md:w-[200px] gap-1.5">
            <Label htmlFor="grant-name">Name (Optional)</Label>
            <Input 
              id="grant-name" 
              placeholder="John Doe" 
              value={grantName}
              onChange={(e) => setGrantName(e.target.value)}
            />
          </div>
          <div className="grid w-full md:w-[200px] gap-1.5">
            <Label htmlFor="grant-plan">Plan to Grant</Label>
            <Select
              value={grantPlan}
              onValueChange={(val: "single_debug_fix" | "single_scan" | "interview_sprint") => setGrantPlan(val)}
            >
              <SelectTrigger id="grant-plan">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_debug_fix">Arreglo Rápido (€5.99)</SelectItem>
                <SelectItem value="single_scan">Pase 24h (€14.99)</SelectItem>
                <SelectItem value="interview_sprint">Sprint 7 Días (€24.99)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGrantPurchase} disabled={isGranting} className="min-w-[120px]">
            {isGranting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Grant Access"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Use this to manually fix users who paid but didn't receive credits. If the user doesn't exist, it will create a new account for them that links when they sign up.
        </p>
      </CardContent>
    </Card>
  );
}