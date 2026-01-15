import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
const apiAny: any = api;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, CheckCircle2, DollarSign, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AdminPaymentsView() {
  const payments = useQuery(apiAny.billing.getAllPayments, {});
  const [previousPaymentCount, setPreviousPaymentCount] = useState(0);

  // Detect new payment and show notification
  useEffect(() => {
    if (payments && payments.length > 0) {
      if (previousPaymentCount > 0 && payments.length > previousPaymentCount) {
        const latestPayment = payments[0];
        toast.success("💰 New Payment Received!", {
          description: `${latestPayment.userName} purchased ${latestPayment.plan === "interview_sprint" ? "Interview Sprint" : "Single Scan"} for $${latestPayment.amount}`,
          duration: 5000,
        });
      }
      setPreviousPaymentCount(payments.length);
    }
  }, [payments]);


  const totalRevenue = payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const singleScanCount = payments?.filter((p: any) => p.plan === "single_scan").length || 0;
  const interviewSprintCount = payments?.filter((p: any) => p.plan === "interview_sprint").length || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="h-12 w-12 text-emerald-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Total Revenue</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-display font-bold text-white">
              ${totalRevenue.toFixed(2)}
            </h3>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              Live
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Total Payments</p>
          <h3 className="text-2xl font-display font-bold text-white">
            {payments?.length || 0}
          </h3>
          <p className="text-xs text-slate-500 mt-1">All time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="h-12 w-12 text-amber-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Single Scans</p>
          <h3 className="text-2xl font-display font-bold text-white">
            {singleScanCount}
          </h3>
          <p className="text-xs text-slate-500 mt-1">${(singleScanCount * 9.99).toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-5 rounded-xl border border-slate-700/50 relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="h-12 w-12 text-primary" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Interview Sprints</p>
          <h3 className="text-2xl font-display font-bold text-white">
            {interviewSprintCount}
          </h3>
          <p className="text-xs text-slate-500 mt-1">${(interviewSprintCount * 19.99).toFixed(2)}</p>
        </motion.div>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Recent Payments
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time payment transactions across all users
          </p>
        </CardHeader>
        <CardContent>
          {!payments ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-semibold text-white mb-2">No Payments Yet</p>
              <p className="text-sm text-muted-foreground">
                Payment transactions will appear here as users make purchases
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: any, index: number) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {new Date(payment.purchasedAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(payment.purchasedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {payment.userName?.charAt(0) || "?"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{payment.userName || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">{payment.userEmail || "No email"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={payment.plan === "interview_sprint" ? "default" : "outline"}
                          className="capitalize"
                        >
                          {payment.plan === "interview_sprint" ? "Interview Sprint" : "Single Scan"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-bold text-emerald-400">
                          ${payment.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono text-muted-foreground">
                          {payment.transactionId.substring(0, 16)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
