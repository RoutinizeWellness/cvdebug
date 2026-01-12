import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AdminStatsProps {
  stats: {
    total: number;
    free: number;
    singleScan: number;
    bulkPack: number;
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
      <div className="grid grid-cols-4 gap-4">
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
          <CardTitle className="text-sm font-medium text-muted-foreground">Single Scan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.singleScan}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Interview Sprint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.bulkPack}</div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}