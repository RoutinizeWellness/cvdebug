import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, Bell, TrendingUp, Shield, CreditCard, Users, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function EmailPreferences() {
  const preferences = useQuery(api.emailPreferences.getEmailPreferences);
  const emailStats = useQuery(api.emailPreferences.getEmailStats);
  const updatePreference = useMutation(api.emailPreferences.updateEmailPreferences);
  const [loading, setLoading] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // If preferences is undefined (loading), show loading state
  if (preferences === undefined) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading preferences...</p>
        </div>
      </div>
    );
  }

  // If preferences is null (not authenticated or error), show default preferences
  if (preferences === null) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Email Preferences Not Available</h3>
          <p className="text-sm text-muted-foreground">
            You need to be signed in to manage email preferences. Please refresh the page or sign in again.
          </p>
        </div>
      </div>
    );
  }

  const handleToggle = async (category: string, currentValue: boolean) => {
    setLoading(category);
    try {
      await updatePreference({
        category,
        enabled: !currentValue,
      });
      toast.success(
        !currentValue ? `Enabled ${formatCategoryName(category)} emails` : `Disabled ${formatCategoryName(category)} emails`
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update preference");
    } finally {
      setLoading(null);
    }
  };

  const handleUnsubscribeAll = async () => {
    if (!confirm("Are you sure you want to unsubscribe from all marketing emails?")) {
      return;
    }

    setLoading("unsubscribe_all");
    try {
      await updatePreference({ unsubscribeAll: true });
      toast.success("Unsubscribed from all marketing emails");
    } catch (error: any) {
      toast.error(error.message || "Failed to unsubscribe");
    } finally {
      setLoading(null);
    }
  };

  const formatCategoryName = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ONBOARDING': return <Sparkles className="h-4 w-4" />;
      case 'RESUME_TIPS': return <TrendingUp className="h-4 w-4" />;
      case 'UPGRADE_PROMPT': return <AlertCircle className="h-4 w-4" />;
      case 'APPLICATION_TRACKING': return <Bell className="h-4 w-4" />;
      case 'SKILL_GAP_ALERTS': return <TrendingUp className="h-4 w-4" />;
      case 'SUCCESS_METRICS': return <Users className="h-4 w-4" />;
      case 'ACCOUNT_SECURITY': return <Shield className="h-4 w-4" />;
      case 'BILLING': return <CreditCard className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getCategoryDescription = (category: string): string => {
    const descriptions: Record<string, string> = {
      'ONBOARDING': 'Get started tips and welcome messages',
      'RESUME_TIPS': 'Weekly resume optimization tips and industry insights',
      'UPGRADE_PROMPT': 'Notifications about premium features and special offers',
      'APPLICATION_TRACKING': 'Real-time updates on your job applications',
      'SKILL_GAP_ALERTS': 'Notifications when we detect skill gaps in your resume',
      'SUCCESS_METRICS': 'Weekly success reports and achievement summaries',
      'ACCOUNT_SECURITY': 'Critical security alerts and account notifications',
      'BILLING': 'Payment receipts and subscription updates',
    };
    return descriptions[category] || '';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Email Preferences</h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Manage what emails you receive
          </p>
        </div>
        <Badge variant="outline" className="text-xs whitespace-nowrap self-start sm:self-auto">
          {preferences.tier === 'free' ? 'Free' : preferences.tier === 'single_scan' ? 'Single Scan' : 'Interview Sprint'} Plan
        </Badge>
      </div>

      {/* Email Stats - Mobile Optimized */}
      {emailStats && (
        <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 md:p-3 bg-primary/20 rounded-lg flex-shrink-0">
                <Mail className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">Emails this week</p>
                <p className="text-xl md:text-2xl font-bold text-foreground">{emailStats.totalLastWeek}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end sm:text-right gap-6 sm:gap-0 pl-11 sm:pl-0">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Open rate</p>
                <p className="text-base md:text-lg font-semibold text-primary">
                  {Math.round(emailStats.openRate * 100)}%
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Unsubscribed Notice */}
      {preferences.unsubscribedFromMarketing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">You're unsubscribed from marketing emails</p>
              <p className="text-xs text-muted-foreground mt-1">You'll still receive critical account and billing notifications</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Preferences Grid */}
      <div className="grid gap-4">
        {Object.entries(preferences.preferences).map(([category, enabled]) => {
          const isDisabledByTier = !enabled && Object.keys(preferences.preferences).includes(category);
          const isCritical = ['ACCOUNT_SECURITY', 'BILLING'].includes(category);
          const isEnabled = Boolean(enabled);

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * Object.keys(preferences.preferences).indexOf(category) }}
            >
              <Card className={`p-3 md:p-4 ${isCritical ? 'border-primary/30 bg-primary/5' : ''}`}>
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Icon - Responsive */}
                  <div className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${isEnabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {getCategoryIcon(category)}
                  </div>

                  {/* Content - Flexible */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-1">
                      <h3 className="text-sm md:text-base font-semibold text-foreground">
                        {formatCategoryName(category)}
                      </h3>
                      {isCritical && (
                        <Badge variant="outline" className="text-[10px] md:text-xs border-primary text-primary px-1.5 py-0">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                      {getCategoryDescription(category)}
                    </p>
                    {emailStats?.byCategory[category] && (
                      <p className="text-[10px] md:text-xs text-muted-foreground mt-1.5 md:mt-2">
                        {emailStats.byCategory[category]} sent this week
                      </p>
                    )}
                  </div>

                  {/* Switch - Touch friendly size */}
                  <div className="flex-shrink-0 ml-auto">
                    <Switch
                      checked={isEnabled}
                      disabled={isCritical || loading === category || preferences.unsubscribedFromMarketing}
                      onCheckedChange={() => handleToggle(category, isEnabled)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Unsubscribe All - Mobile Optimized */}
      {!preferences.unsubscribedFromMarketing && (
        <div className="pt-4 md:pt-6 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnsubscribeAll}
            disabled={loading === 'unsubscribe_all'}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto text-xs md:text-sm h-9 md:h-10"
          >
            {loading === 'unsubscribe_all' ? 'Unsubscribing...' : 'Unsubscribe from all marketing emails'}
          </Button>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-2 leading-relaxed">
            You'll still receive critical account and billing notifications
          </p>
        </div>
      )}
    </div>
  );
}
