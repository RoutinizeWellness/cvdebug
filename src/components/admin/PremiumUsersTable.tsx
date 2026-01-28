import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react";

interface PremiumUser {
  _id: string;
  _creationTime: number;
  email: string;
  name?: string;
  plan: string;
  revenue: number;
  credits: number;
  isActive: boolean;
  sprintExpiresAt?: number;
  lastSeen?: number;
}

interface PremiumUsersTableProps {
  users: PremiumUser[];
  stats?: {
    revenue: {
      singleScan: number;
      sprint: number;
      total: number;
    };
    singleScan: number;
    interviewSprint: number;
    careerSprint: number;
  };
}

export function PremiumUsersTable({ users, stats }: PremiumUsersTableProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(stats.revenue.total)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {users.length} paying customers
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-600" />
                Single Scan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {stats.singleScan}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(stats.revenue.singleScan)} total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Career Sprint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {stats.interviewSprint}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(stats.revenue.sprint)} total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Premium Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-semibold">User</th>
                  <th className="text-left p-3 text-sm font-semibold">Plan</th>
                  <th className="text-left p-3 text-sm font-semibold">Revenue</th>
                  <th className="text-left p-3 text-sm font-semibold">Credits</th>
                  <th className="text-left p-3 text-sm font-semibold">Status</th>
                  <th className="text-left p-3 text-sm font-semibold">Purchase Date</th>
                  <th className="text-left p-3 text-sm font-semibold">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-muted-foreground">
                      No premium users yet
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{user.name || 'No name'}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={user.plan.includes('Sprint') ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {user.plan.includes('Sprint') ? '⚡ Sprint' : '📄 Single'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-green-600">
                          {formatCurrency(user.revenue)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-sm">{user.credits}</span>
                      </td>
                      <td className="p-3">
                        {user.isActive ? (
                          <Badge variant="default" className="bg-green-600 text-xs">
                            ✓ Activo
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Expirado
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(user._creationTime)}
                        </div>
                      </td>
                      <td className="p-3">
                        {user.lastSeen ? (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(user.lastSeen)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {users.length > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Showing {users.length} premium users
                </span>
                <span className="font-semibold">
                  Total generado: {formatCurrency(users.reduce((sum, u) => sum + u.revenue, 0))}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
