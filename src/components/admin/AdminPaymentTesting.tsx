import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CreditCard, Zap, Building2, Sparkles } from "lucide-react";

interface AdminPaymentTestingProps {
  handleTestPayment: (plan: "single_debug_fix" | "single_scan" | "interview_sprint") => void;
  isTestingPayment: string | null;
  webhookEmail: string;
  setWebhookEmail: (value: string) => void;
  webhookPlan: "single_debug_fix" | "single_scan" | "interview_sprint";
  setWebhookPlan: (value: "single_debug_fix" | "single_scan" | "interview_sprint") => void;
  handleSimulateWebhook: () => void;
  isSimulatingWebhook: boolean;
}

export function AdminPaymentTesting({
  handleTestPayment,
  isTestingPayment,
  webhookEmail,
  setWebhookEmail,
  webhookPlan,
  setWebhookPlan,
  handleSimulateWebhook,
  isSimulatingWebhook
}: AdminPaymentTestingProps) {
  return (
    <Card className="mb-8 border-green-500/20 bg-green-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-600" />
          Test Payment Flow (Stripe/Autumn)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Real Checkout */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">1. Test Real Checkout Redirect</h3>
            <p className="text-xs text-muted-foreground">
              Initiate a real checkout session to verify the payment provider connection.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => handleTestPayment("single_debug_fix")}
                disabled={!!isTestingPayment}
                variant="outline"
                size="sm"
                className="border-amber-200 hover:bg-amber-50 hover:text-amber-700"
              >
                {isTestingPayment === "single_debug_fix" ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Zap className="mr-2 h-3 w-3" />}
                Test Debug Fix (€5.99)
              </Button>
              <Button
                onClick={() => handleTestPayment("single_scan")}
                disabled={!!isTestingPayment}
                variant="outline"
                size="sm"
                className="border-green-200 hover:bg-green-50 hover:text-green-700"
              >
                {isTestingPayment === "single_scan" ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Zap className="mr-2 h-3 w-3" />}
                Test 24h Pass (€14.99)
              </Button>
              <Button
                onClick={() => handleTestPayment("interview_sprint")}
                disabled={!!isTestingPayment}
                variant="outline"
                size="sm"
                className="border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                {isTestingPayment === "interview_sprint" ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Building2 className="mr-2 h-3 w-3" />}
                Test Sprint (€24.99)
              </Button>
            </div>
          </div>

          {/* Right: Webhook Simulation */}
          <div className="flex flex-col gap-4 border-l pl-8 border-green-500/20">
            <h3 className="text-sm font-semibold text-foreground">2. Test Post-Payment Logic (Webhook)</h3>
            <p className="text-xs text-muted-foreground">
              Simulate a successful payment event from the provider to verify credit granting logic.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input 
                  placeholder="User Email" 
                  value={webhookEmail}
                  onChange={(e) => setWebhookEmail(e.target.value)}
                  className="h-8 text-xs bg-background"
                />
                <Select
                  value={webhookPlan}
                  onValueChange={(val: "single_debug_fix" | "single_scan" | "interview_sprint") => setWebhookPlan(val)}
                >
                  <SelectTrigger className="h-8 w-[160px] text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_debug_fix">Debug Fix (€5.99)</SelectItem>
                    <SelectItem value="single_scan">24h Pass (€14.99)</SelectItem>
                    <SelectItem value="interview_sprint">Sprint (€24.99)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSimulateWebhook}
                disabled={isSimulatingWebhook}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSimulatingWebhook ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Sparkles className="mr-2 h-3 w-3" />}
                Simulate Payment Success
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}