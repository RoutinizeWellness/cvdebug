import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AdminStatsProps {
  stats: {
    total: number;
    free: number;
    singleDebugFix: number;
    singleScan: number;
    interviewSprint: number;
    revenue?: {
      singleDebugFix: number;
      singleScan: number;
      sprint: number;
      total: number;
    };
  } | undefined;
  onSyncPayments?: () => void;
  isSyncing?: boolean;
}

export function AdminStats({ stats, onSyncPayments, isSyncing }: AdminStatsProps) {
  if (!stats) return null;

  return (
    <div className="space-y-4 mb-8">
      {onSyncPayments && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">User Statistics</h3>
            <p className="text-sm text-muted-foreground">
              Overview of user subscriptions and payment status
            </p>
          </div>
          <Button
            onClick={onSyncPayments}
            disabled={isSyncing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync from Autumn'}
          </Button>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Free Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.free}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Arreglo Rápido (€5.99)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{stats.singleDebugFix}</div>
          {stats.revenue && (
            <p className="text-xs text-muted-foreground mt-1">
              €{stats.revenue.singleDebugFix.toFixed(2)}
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pase 24h (€14.99)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.singleScan}</div>
          {stats.revenue && (
            <p className="text-xs text-muted-foreground mt-1">
              €{stats.revenue.singleScan.toFixed(2)}
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Sprint 7 Días (€24.99)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.interviewSprint}</div>
          {stats.revenue && (
            <p className="text-xs text-muted-foreground mt-1">
              €{stats.revenue.sprint.toFixed(2)}
            </p>
          )}
        </CardContent>
      </Card>
      </div>

      {stats.revenue && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">€{stats.revenue.total.toFixed(2)}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}