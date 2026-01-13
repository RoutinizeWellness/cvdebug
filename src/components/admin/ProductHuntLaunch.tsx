import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Users, TrendingUp, Copy, CheckCircle2, Mail, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ProductHuntLaunch() {
  const launchTeam = useQuery(api.productHunt.getLaunchTeam);
  const stats = useQuery(api.productHunt.getProductHuntStats);
  const createCoupon = useMutation(api.productHunt.createProductHuntCoupon);

  const [copied, setCopied] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState<"initial" | "2hour">("initial");

  const handleCreateCoupon = async () => {
    try {
      const result = await createCoupon({});
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCopyEmails = () => {
    if (!launchTeam) return;

    const emails = launchTeam
      .filter((u: any) => u.email)
      .map((u: any) => u.email)
      .join(", ");

    navigator.clipboard.writeText(emails);
    setCopied(true);
    toast.success(`Copied ${launchTeam.length} emails to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEmailTemplate = () => {
    if (emailTemplate === "initial") {
      return {
        subject: "🚀 CVDebug is launching on Product Hunt TODAY - Need your support!",
        body: `Hi there,

You're part of the CVDebug family! We're launching on Product Hunt TODAY and would love your support.

🎯 WHY THIS MATTERS:
The first 2 hours are CRITICAL. Getting upvotes and comments early determines if we reach the top 5 and get featured to millions of job seekers.

🎁 SPECIAL THANK YOU:
Use code PH50 for 50% off any plan (next 48 hours only)

⚡ HOW TO HELP (takes 2 minutes):
1. Visit: https://www.producthunt.com/posts/cvdebug
2. Click the orange "UPVOTE" button
3. Leave a quick comment about your experience

🙏 Your support means everything. Let's help job seekers worldwide beat ATS systems!

Thank you,
The CVDebug Team

P.S. Forward this to anyone who's ever struggled with their resume!`,
      };
    } else {
      return {
        subject: "⏰ Final 2 hours! CVDebug needs one more push",
        body: `Quick update:

We're SO CLOSE to Top 5 on Product Hunt! Just need a final push in the next 2 hours.

If you haven't yet:
👉 https://www.producthunt.com/posts/cvdebug

Every upvote counts. Thank you! 🙏`,
      };
    }
  };

  if (!launchTeam || !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const { subject, body } = getEmailTemplate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            Product Hunt Launch Control
          </h2>
          <p className="text-muted-foreground mt-1">
            Coordinate the launch team and track performance
          </p>
        </div>
        <Button onClick={handleCreateCoupon} variant="default">
          Create PH50 Coupon
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Launch Team</p>
              <p className="text-3xl font-bold text-white">{launchTeam.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">PH Visits</p>
              <p className="text-3xl font-bold text-white">{stats.totalVisits}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-3xl font-bold text-white">{stats.conversionRate}%</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">PH50 Used</p>
              <p className="text-3xl font-bold text-white">
                {stats.couponUsages}/{stats.couponMaxUses}
              </p>
            </div>
            <Badge variant={stats.couponActive ? "default" : "secondary"}>
              {stats.couponActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Email Campaign Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Launch Email Campaign
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant={emailTemplate === "initial" ? "default" : "outline"}
                size="sm"
                onClick={() => setEmailTemplate("initial")}
              >
                Initial Launch
              </Button>
              <Button
                variant={emailTemplate === "2hour" ? "default" : "outline"}
                size="sm"
                onClick={() => setEmailTemplate("2hour")}
              >
                2-Hour Push
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Subject:</p>
              <p className="text-sm text-white font-mono">{subject}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Body:</p>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-background/50 p-3 rounded">
                {body}
              </pre>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleCopyEmails} variant="default">
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All Emails
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              {launchTeam.filter((u: any) => u.email).length} emails ready to send
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-500">
              <p className="font-semibold mb-1">⚠️ Launch Strategy:</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-500/90">
                <li>Send "Initial Launch" email 30 minutes BEFORE going live</li>
                <li>Launch on Product Hunt at 12:01 AM PST for maximum visibility</li>
                <li>Send "2-Hour Push" email exactly 2 hours after launch</li>
                <li>Monitor first 6 hours closely - respond to ALL comments</li>
                <li>Share on Twitter, LinkedIn, Reddit (r/resumes, r/jobs)</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Launch Team Members */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Launch Team Members</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {launchTeam.map((user: any) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {user.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {user.subscriptionTier}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {user.creditsUsed} scans
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
