import { useQuery, useMutation, useAction } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
const apiAny: any = api;
import { 
  Loader2, 
  ShieldAlert, 
  Save, 
  Menu,
  LayoutDashboard,
  Users,
  BarChart3,
  Terminal,
  Settings,
  CreditCard,
  LogOut,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PaymentHistoryDialog } from "@/components/admin/PaymentHistoryDialog";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminManualGrant } from "@/components/admin/AdminManualGrant";
import { AdminBulkGrant } from "@/components/admin/AdminBulkGrant";
import { AdminPaymentTesting } from "@/components/admin/AdminPaymentTesting";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { AdminDataImport } from "@/components/admin/AdminDataImport";
import { AdminPaymentsView } from "@/components/admin/AdminPaymentsView";
import { PremiumUsersTable } from "@/components/admin/PremiumUsersTable";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { motion } from "framer-motion";

export default function AdminPage() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const shouldFetch = !authLoading && user?.email === "tiniboti@gmail.com";
  const users = useQuery(apiAny.admin.getUsers, shouldFetch ? {} : "skip");
  const stats = useQuery(apiAny.admin.getAdminStats, shouldFetch ? {} : "skip");
  const premiumUsers = useQuery(apiAny.admin.getPremiumUsers, shouldFetch ? {} : "skip");
  const updateUserPlan = useMutation(apiAny.admin.updateUserPlan);
  const deleteUser = useMutation(apiAny.admin.deleteUser);
  const createUserMutation = useMutation(apiAny.admin.createUser);
  const fixInconsistentUsers = useMutation(apiAny.admin.fixInconsistentUsers);
  const fixKnownMissingUsers = useMutation(apiAny.admin.fixKnownMissingUsers);
  const fixSpecificReportedUsers = useMutation(apiAny.admin.fixSpecificReportedUsers);
  const grantPurchase = useMutation(apiAny.admin.grantPurchase);
  const processBulkGrants = useMutation(apiAny.admin.processBulkGrants);
  const syncUsersFromPayments = useMutation(apiAny.admin.syncUsersFromPayments);
  const simulateWebhook = useAction(apiAny.admin.simulateWebhookEvent);
  const createCheckoutSession = useAction(apiAny.billingActions.createCheckoutSession);

  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ plan: "free", credits: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    plan: "free" as "free" | "single_scan" | "interview_sprint"
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isFixingKnown, setIsFixingKnown] = useState(false);
  const [isFixingReported, setIsFixingReported] = useState(false);
  const [historyUser, setHistoryUser] = useState<{id: string, name: string, email?: string} | null>(null);
  const [grantEmail, setGrantEmail] = useState("");
  const [grantName, setGrantName] = useState("");
  const [grantPlan, setGrantPlan] = useState<"single_scan" | "interview_sprint">("single_scan");
  const [isGranting, setIsGranting] = useState(false);
  const [webhookEmail, setWebhookEmail] = useState("");
  const [webhookPlan, setWebhookPlan] = useState<"single_scan" | "interview_sprint">("single_scan");
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);
  const [isTestingPayment, setIsTestingPayment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && user && user.email !== "tiniboti@gmail.com") {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setEditForm({
      plan: user.subscriptionTier || "free",
      credits: user.credits || 0
    });
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await updateUserPlan({
        userId: editingUser._id as Id<"users">,
        plan: editForm.plan as "free" | "single_scan" | "interview_sprint",
        credits: Number(editForm.credits)
      });
      toast.success("User updated successfully");
      setEditingUser(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFixInconsistent = async () => {
    setIsFixing(true);
    try {
      const result = await fixInconsistentUsers();
      toast.success(result);
    } catch (error) {
      toast.error("Failed to fix users");
    } finally {
      setIsFixing(false);
    }
  };

  const handleFixKnownMissing = async () => {
    setIsFixingKnown(true);
    try {
      const result = await fixKnownMissingUsers();
      toast.success("Fix Complete", { description: result, duration: 5000 });
    } catch (error) {
      toast.error("Failed to fix known missing users");
    } finally {
      setIsFixingKnown(false);
    }
  };

  const handleFixReported = async () => {
    setIsFixingReported(true);
    try {
      const result = await fixSpecificReportedUsers();
      toast.success("Reported Users Fix Complete", {
        description: <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto text-xs text-white">{result}</pre>,
        duration: 10000,
      });
    } catch (error) {
      toast.error("Failed to fix reported users");
    } finally {
      setIsFixingReported(false);
    }
  };

  const handleDelete = async (userId: Id<"users">) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser({ userId });
      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleGrantPurchase = async () => {
    if (!grantEmail) {
      toast.error("Please enter an email or user ID");
      return;
    }
    setIsGranting(true);
    try {
      const result = await grantPurchase({
        identifier: grantEmail.trim(),
        plan: grantPlan,
        name: grantName.trim() || undefined,
      });
      toast.success(result);
      setGrantEmail("");
      setGrantName("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to grant purchase");
    } finally {
      setIsGranting(false);
    }
  };

  const handleBulkGrant = async () => {
    if (!bulkText.trim()) {
      toast.error("Please paste text containing emails");
      return;
    }
    setIsBulkProcessing(true);
    setBulkResult(null);
    try {
      const result = await processBulkGrants({ rawText: bulkText });
      setBulkResult(result);
      toast.success("Bulk processing complete");
      setBulkText("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to process bulk grants");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleTestPayment = async (plan: "single_scan" | "interview_sprint") => {
    setIsTestingPayment(plan);
    try {
      const url = await createCheckoutSession({
        plan,
        origin: window.location.origin
      });
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to initiate checkout");
    } finally {
      setIsTestingPayment(null);
    }
  };

  const handleSimulateWebhook = async () => {
    if (!webhookEmail) {
      toast.error("Please enter a user email");
      return;
    }
    setIsSimulatingWebhook(true);
    try {
      const result = await simulateWebhook({
        email: webhookEmail,
        plan: webhookPlan
      });
      toast.success(result);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to simulate webhook");
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  const handleSyncPayments = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const result = await syncUsersFromPayments();
      setSyncResult(result);
      toast.success(`Synced ${result.syncedCount} users from ${result.totalPayments} payments`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to sync payments");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateUser = async () => {
    if (!createUserForm.email) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createUserForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsCreatingUser(true);
    try {
      const result = await createUserMutation({
        email: createUserForm.email.trim(),
        firstName: createUserForm.firstName.trim() || undefined,
        lastName: createUserForm.lastName.trim() || undefined,
        plan: createUserForm.plan,
      });
      toast.success("User created successfully", {
        description: result
      });
      setShowCreateUserDialog(false);
      setCreateUserForm({
        email: "",
        firstName: "",
        lastName: "",
        plan: "free"
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create user");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const filteredUsers = users?.filter((user: any) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.tokenIdentifier?.toLowerCase().includes(search) ||
      user._id.toLowerCase().includes(search)
    );
  }) || [];

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.email !== "tiniboti@gmail.com") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#0F172A]">
        <ShieldAlert className="h-16 w-16 text-[#EF4444]" />
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="text-slate-400">You do not have permission to view this page.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0F172A]">
      {/* Sidebar Navigation */}
      <aside className={`w-64 flex-shrink-0 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-md ${sidebarOpen ? 'flex' : 'hidden'} md:flex`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 flex items-center justify-center mr-3 shadow-lg shadow-blue-900/20">
            <ShieldAlert className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-white font-display font-bold text-2xl leading-tight tracking-tight">CVDebug</h1>
            <p className="text-[#64748B] text-xs font-mono">v2.4.0-prod</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          <button 
            onClick={() => setCurrentView("dashboard")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === "dashboard" ? "bg-primary/10 border border-primary/20 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}
          >
            <LayoutDashboard className={`h-5 w-5 ${currentView === "dashboard" ? "text-primary" : "text-[#64748B]"}`} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView("users")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === "users" ? "bg-primary/10 border border-primary/20 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}
          >
            <Users className={`h-5 w-5 ${currentView === "users" ? "text-primary" : "text-[#64748B]"}`} />
            <span className="text-sm font-medium">Users</span>
          </button>
          <button
            onClick={() => setCurrentView("premium")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === "premium" ? "bg-primary/10 border border-primary/20 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}
          >
            <TrendingUp className={`h-5 w-5 ${currentView === "premium" ? "text-primary" : "text-[#64748B]"}`} />
            <span className="text-sm font-medium">Premium Users</span>
            {stats && (stats.singleScan + stats.interviewSprint) > 0 && (
              <Badge variant="default" className="ml-auto bg-[#22C55E] text-xs">
                {stats.singleScan + stats.interviewSprint}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setCurrentView("analytics")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === "analytics" ? "bg-primary/10 border border-primary/20 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}
          >
            <BarChart3 className={`h-5 w-5 ${currentView === "analytics" ? "text-primary" : "text-[#64748B]"}`} />
            <span className="text-sm font-medium">Analytics</span>
          </button>
          <button 
            onClick={() => setCurrentView("logs")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === "logs" ? "bg-primary/10 border border-primary/20 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}
          >
            <Terminal className={`h-5 w-5 ${currentView === "logs" ? "text-primary" : "text-[#64748B]"}`} />
            <span className="text-sm font-medium">Logs & API</span>
          </button>
          
          <div className="mt-8 px-3 text-xs font-bold text-[#475569] uppercase tracking-wider">Settings</div>
          <button 
            onClick={() => setCurrentView("settings")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === "settings" ? "bg-primary/10 border border-primary/20 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}
          >
            <Settings className={`h-5 w-5 ${currentView === "settings" ? "text-primary" : "text-[#64748B]"}`} />
            <span className="text-sm font-medium">General</span>
          </button>
          <button 
            onClick={() => setCurrentView("billing")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === "billing" ? "bg-primary/10 border border-primary/20 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}
          >
            <CreditCard className={`h-5 w-5 ${currentView === "billing" ? "text-primary" : "text-[#64748B]"}`} />
            <span className="text-sm font-medium">Billing</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0F172A] relative">
        {/* Background Gradient Blurs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-6 bg-slate-900/30 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-white text-xl font-display font-bold">Admin Dashboard</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span className="text-xs text-slate-300 font-medium">System Operational</span>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Stats
            </Button>
              <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-white font-bold text-sm">
                {user.email?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 z-0">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {currentView === "dashboard" && (
              <>
                {/* Sync Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      User metrics and payment synchronization
                    </p>
                  </div>
                  <Button
                    onClick={handleSyncPayments}
                    disabled={isSyncing}
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                  >
                    <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing from Autumn...' : 'Sync Payments from Autumn'}
                  </Button>
                </div>

                {/* Sync Result */}
                {syncResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-[#22C55E]/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
                        <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-emerald-400 mb-1">
                          Sync Complete: {syncResult.syncedCount} users updated
                        </h4>
                        <p className="text-xs text-slate-400 mb-2">
                          Processed {syncResult.totalPayments} payments from Autumn
                        </p>
                        {syncResult.logs && syncResult.logs.length > 0 && (
                          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                            {syncResult.logs.map((log: string, i: number) => (
                              <p key={i} className="text-xs text-[#64748B] font-mono">
                                {log}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setSyncResult(null)}
                        className="flex-shrink-0 text-slate-400 hover:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors relative group overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Users className="h-12 w-12 text-[#3B82F6]" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Total Users</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-display font-bold text-white">{stats?.total || 0}</h3>
                      <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded flex items-center">
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                        12%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700/30 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors relative group overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Users className="h-12 w-12 text-cyan-500" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Free Users</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-display font-bold text-white">{stats?.free || 0}</h3>
                    </div>
                    <div className="w-full bg-slate-700/30 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors relative group overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <CreditCard className="h-12 w-12 text-[#F59E0B]" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Single Scan</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-display font-bold text-white text-orange-600">{stats?.singleScan || 0}</h3>
                    </div>
                    <div className="w-full bg-slate-700/30 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors relative group overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BarChart3 className="h-12 w-12 text-[#22C55E]" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Bulk Pack</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-display font-bold text-white text-[#3B82F6]">{stats?.bulkPack || 0}</h3>
                    </div>
                    <div className="w-full bg-slate-700/30 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-[#22C55E] h-full rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </motion.div>
                </div>

                {/* Admin Tools */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AdminManualGrant
                    grantEmail={grantEmail}
                    setGrantEmail={setGrantEmail}
                    grantName={grantName}
                    setGrantName={setGrantName}
                    grantPlan={grantPlan}
                    setGrantPlan={setGrantPlan}
                    handleGrantPurchase={handleGrantPurchase}
                    isGranting={isGranting}
                  />

                  {/* Create New User Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-xl border border-slate-700/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-display font-bold text-white">Create New User</h3>
                        <p className="text-sm text-slate-400">Add users directly to Clerk + Convex</p>
                      </div>
                      <Users className="h-8 w-8 text-[#22C55E] opacity-20" />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                        <span>Creates user in Clerk authentication</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                        <span>Syncs with Convex database</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                        <span>Assign plan on creation</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowCreateUserDialog(true)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg shadow-emerald-900/30"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Create New User
                    </Button>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminBulkGrant
                    bulkText={bulkText}
                    setBulkText={setBulkText}
                    handleBulkGrant={handleBulkGrant}
                    isBulkProcessing={isBulkProcessing}
                    bulkResult={bulkResult}
                  />
                  <AdminDataImport />
                </div>

                <AdminPaymentTesting
                  handleTestPayment={handleTestPayment}
                  isTestingPayment={isTestingPayment}
                  webhookEmail={webhookEmail}
                  setWebhookEmail={setWebhookEmail}
                  webhookPlan={webhookPlan}
                  setWebhookPlan={setWebhookPlan}
                  handleSimulateWebhook={handleSimulateWebhook}
                  isSimulatingWebhook={isSimulatingWebhook}
                />

                {/* Main Split Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[500px]">
                  {/* User Table */}
                  <div className="xl:col-span-2 glass-panel rounded-xl border border-slate-700/50 flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-slate-700/50 flex flex-wrap gap-4 justify-between items-center bg-slate-800/20">
                      <div>
                        <h3 className="text-lg font-display font-bold text-white">Recent Users</h3>
                        <p className="text-slate-400 text-sm">Managing {stats?.total || 0} total accounts</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentView("users")} className="text-primary hover:text-primary/80">
                        View All Users
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900/30 text-xs uppercase font-semibold text-[#64748B]">
                          <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Scan</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {filteredUsers.slice(0, 5).map((userData: any) => (
                            <tr key={userData._id} className="hover:bg-slate-800/30 transition-colors group">
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs border border-slate-600">
                                    {userData.name?.charAt(0) || "?"}
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-200">{userData.name || "Anonymous"}</div>
                                    <div className="text-xs text-[#64748B]">{userData.email || "No email"}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3">
                                <Badge 
                                  variant={userData.subscriptionTier === "interview_sprint" ? "default" : userData.subscriptionTier === "single_scan" ? "outline" : "secondary"}
                                  className="capitalize"
                                >
                                  {(userData.subscriptionTier || "free").replace("_", " ")}
                                </Badge>
                              </td>
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                  <span className="text-slate-300">Active</span>
                                </div>
                              </td>
                              <td className="px-6 py-3 font-mono text-xs">
                                {userData.lastScanDate ? new Date(userData.lastScanDate).toLocaleDateString('es-ES') : "Never"}
                              </td>
                              <td className="px-6 py-3 text-right">
                                <button 
                                  onClick={() => handleEditClick(userData)}
                                  className="text-[#64748B] hover:text-white transition-colors"
                                >
                                  <MoreHorizontal className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Live Logs Terminal */}
                  <div className="glass-panel rounded-xl border border-slate-700/50 flex flex-col overflow-hidden h-full shadow-2xl shadow-black/40">
                    <div className="p-3 bg-[#0d1117] border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-[#64748B]" />
                        <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">Live Logs</span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                      </div>
                    </div>
                    <div className="flex-1 bg-[#090e13] p-4 font-mono text-xs overflow-y-auto flex flex-col gap-3 font-medium">
                      <div className="flex gap-2 opacity-60">
                        <span className="text-[#64748B] min-w-[60px]">10:41:02</span>
                        <div className="flex-1">
                          <span className="text-blue-400">[INFO]</span> System initialization complete.
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#64748B] min-w-[60px]">10:42:15</span>
                        <div className="flex-1">
                          <span className="text-emerald-400">[200 OK]</span> OpenAI API - Resume Analysis <span className="text-[#64748B]">#492a</span>
                        </div>
                      </div>
                      <div className="flex gap-2 border-l-2 border-cyan-500/50 pl-2 bg-cyan-500/5 py-1 rounded-r">
                        <span className="text-[#64748B] min-w-[52px]">10:43:12</span>
                        <div className="flex-1 text-cyan-200">
                          <span className="text-cyan-400 font-bold">[STRIPE]</span> Payment Succeeded - €19.99
                          <span className="text-[#64748B] text-[10px] block mt-1">user: {user.email}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#64748B] min-w-[60px]">10:44:05</span>
                        <div className="flex-1">
                          <span className="text-amber-400">[WARN]</span> High latency detected on worker-04
                        </div>
                      </div>
                      <div className="animate-pulse flex gap-2 mt-2">
                        <span className="text-primary">_</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentView === "users" && (
              <AdminUserTable
                users={users}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleEditClick={handleEditClick}
                handleDelete={handleDelete}
                setHistoryUser={setHistoryUser}
              />
            )}

            {currentView === "premium" && (
              <PremiumUsersTable
                users={premiumUsers || []}
                stats={stats}
              />
            )}

            {currentView === "analytics" && (
              <div className="flex items-center justify-center h-[400px] text-slate-400">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold text-white">Analytics Module</h3>
                  <p>Detailed analytics and reporting coming soon.</p>
                </div>
              </div>
            )}

            {currentView === "logs" && (
              <div className="flex items-center justify-center h-[400px] text-slate-400">
                <div className="text-center">
                  <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold text-white">System Logs</h3>
                  <p>Real-time system logs and API monitoring coming soon.</p>
                </div>
              </div>
            )}

            {currentView === "settings" && (
              <div className="flex items-center justify-center h-[400px] text-slate-400">
                <div className="text-center">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold text-white">Settings</h3>
                  <p>Global system configuration coming soon.</p>
                </div>
              </div>
            )}

            {currentView === "billing" && (
              <AdminPaymentsView />
            )}
          </div>
        </div>
      </main>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-slate-400">
              Manually update subscription and credits for {editingUser?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right text-slate-300">Plan</Label>
              <Select 
                value={editForm.plan} 
                onValueChange={(val) => setEditForm({...editForm, plan: val})}
              >
                <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="single_scan">Single Scan (€4.99)</SelectItem>
                  <SelectItem value="interview_sprint">Interview Sprint (€19.99)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right text-slate-300">Credits</Label>
              <Input
                id="credits"
                type="number"
                value={editForm.credits}
                onChange={(e) => setEditForm({...editForm, credits: parseInt(e.target.value) || 0})}
                className="col-span-3 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)} className="border-slate-700">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment History Dialog */}
      <PaymentHistoryDialog
        isOpen={!!historyUser}
        onClose={() => setHistoryUser(null)}
        userId={historyUser?.id || ""}
        userName={historyUser?.name || ""}
        userEmail={historyUser?.email}
      />

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleSignOut}
      />

      {/* Create User Dialog */}
      <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription className="text-slate-400">
              Create a new user account in both Clerk and Convex. The user will be able to log in with their email.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-slate-300">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={createUserForm.email}
                onChange={(e) => setCreateUserForm({...createUserForm, email: e.target.value})}
                className="col-span-3 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right text-slate-300">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={createUserForm.firstName}
                onChange={(e) => setCreateUserForm({...createUserForm, firstName: e.target.value})}
                className="col-span-3 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right text-slate-300">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={createUserForm.lastName}
                onChange={(e) => setCreateUserForm({...createUserForm, lastName: e.target.value})}
                className="col-span-3 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right text-slate-300">Plan</Label>
              <Select
                value={createUserForm.plan}
                onValueChange={(val: any) => setCreateUserForm({...createUserForm, plan: val})}
              >
                <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="free">Free Preview</SelectItem>
                  <SelectItem value="single_scan">Single Scan (€4.99)</SelectItem>
                  <SelectItem value="interview_sprint">Interview Sprint (€19.99)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateUserDialog(false);
                setCreateUserForm({ email: "", firstName: "", lastName: "", plan: "free" });
              }}
              className="border-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={isCreatingUser}
              className="bg-gradient-to-r from-emerald-600 to-green-600"
            >
              {isCreatingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}