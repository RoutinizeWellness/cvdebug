import { useQuery, useMutation, useAction } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

// Cast to any to avoid deep type instantiation errors
import { api } from "@/convex/_generated/api";
const apiAny: any = api;
import { 
  PlusCircle, 
  Loader2, 
  ShieldAlert, 
  Pencil, 
  Trash2, 
  Save, 
  X, 
  RefreshCw,
  Sparkles,
  Receipt,
  CreditCard,
  Zap,
  Building2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { PaymentHistoryDialog } from "@/components/admin/PaymentHistoryDialog";

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // We can't conditionally call hooks, but we can handle the error/loading states in render
  const shouldFetch = !authLoading && user?.email === "tiniboti@gmail.com";
  const users = useQuery(apiAny.admin.getUsers, shouldFetch ? {} : "skip");
  const stats = useQuery(apiAny.admin.getAdminStats, shouldFetch ? {} : "skip");
  const updateUserPlan = useMutation(apiAny.admin.updateUserPlan);
  const deleteUser = useMutation(apiAny.admin.deleteUser);
  const fixInconsistentUsers = useMutation(apiAny.admin.fixInconsistentUsers);
  const fixKnownMissingUsers = useMutation(apiAny.admin.fixKnownMissingUsers);
  const fixSpecificReportedUsers = useMutation(apiAny.admin.fixSpecificReportedUsers);
  const grantPurchase = useMutation(apiAny.admin.grantPurchase);
  const processBulkGrants = useMutation(apiAny.admin.processBulkGrants);
  const simulateWebhook = useAction(apiAny.admin.simulateWebhookEvent);
  const createCheckoutSession = useAction(apiAny.billingActions.createCheckoutSession);

  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    plan: "free",
    credits: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isFixingKnown, setIsFixingKnown] = useState(false);
  const [isFixingReported, setIsFixingReported] = useState(false);
  
  // Payment History State
  const [historyUser, setHistoryUser] = useState<{id: string, name: string, email?: string} | null>(null);
  
  // Manual Grant State
  const [grantEmail, setGrantEmail] = useState("");
  const [grantName, setGrantName] = useState("");
  const [grantPlan, setGrantPlan] = useState<"single_scan" | "interview_sprint">("single_scan");
  const [isGranting, setIsGranting] = useState(false);
  
  // Webhook Simulation State
  const [webhookEmail, setWebhookEmail] = useState("");
  const [webhookPlan, setWebhookPlan] = useState<"single_scan" | "interview_sprint">("single_scan");
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);
  
  // Bulk Grant State
  const [bulkText, setBulkText] = useState("");
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);
  
  // Payment Testing State
  const [isTestingPayment, setIsTestingPayment] = useState<string | null>(null);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");

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
      toast.success("Fix Complete", {
        description: result,
        duration: 5000,
      });
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

  // Filter users based on search
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
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.email !== "tiniboti@gmail.com") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <ShieldAlert className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users and view subscription details.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
             <Button variant="outline" onClick={handleFixReported} disabled={isFixingReported} className="border-orange-500/50 hover:bg-orange-500/10 text-orange-600">
                {isFixingReported ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                Fix Reported (3 Users)
             </Button>
             <Button variant="outline" onClick={handleFixInconsistent} disabled={isFixing}>
                {isFixing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                Auto-Fix Inconsistent
             </Button>
             <Button variant="outline" onClick={handleFixKnownMissing} disabled={isFixingKnown}>
                {isFixingKnown ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Fix Known Missing (4)
             </Button>
          </div>
        </div>

        {/* Bulk Grant Section */}
        <Card className="mb-8 border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Bulk Grant from Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="bulk-text">Paste Transaction List (Emails will be extracted)</Label>
                <Textarea 
                  id="bulk-text" 
                  placeholder="Paste the list of transactions here (e.g. from Stripe or email). We will find emails like user@example.com and grant 1 credit for each occurrence." 
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="min-h-[100px] font-mono text-xs"
                />
              </div>
              <div className="flex items-start justify-between gap-4">
                <Button onClick={handleBulkGrant} disabled={isBulkProcessing} className="bg-blue-600 hover:bg-blue-700">
                  {isBulkProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Process Bulk Grants
                </Button>
                {bulkResult && (
                  <div className="flex-1 bg-background border rounded-md p-3 text-xs font-mono overflow-auto max-h-[200px]">
                    <pre>{bulkResult}</pre>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Testing Section */}
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
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleTestPayment("single_scan")} 
                    disabled={!!isTestingPayment}
                    variant="outline"
                    size="sm"
                    className="border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    {isTestingPayment === "single_scan" ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Zap className="mr-2 h-3 w-3" />}
                    Test Single ($4.99)
                  </Button>
                  <Button 
                    onClick={() => handleTestPayment("interview_sprint")} 
                    disabled={!!isTestingPayment}
                    variant="outline"
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {isTestingPayment === "interview_sprint" ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Building2 className="mr-2 h-3 w-3" />}
                    Test Sprint ($14.99)
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
                      onValueChange={(val: "single_scan" | "interview_sprint") => setWebhookPlan(val)}
                    >
                      <SelectTrigger className="h-8 w-[130px] text-xs bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single_scan">Single Scan</SelectItem>
                        <SelectItem value="interview_sprint">Interview Sprint</SelectItem>
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

        {/* Manual Grant Section */}
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
                  onValueChange={(val: "single_scan" | "interview_sprint") => setGrantPlan(val)}
                >
                  <SelectTrigger id="grant-plan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_scan">Single Scan</SelectItem>
                    <SelectItem value="interview_sprint">Interview Sprint</SelectItem>
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

        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Free Users</CardTitle>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Bulk Pack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.bulkPack}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registered Users</CardTitle>
            <div className="w-[300px]">
              <Input 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {!users ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Scans</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((userData: any) => (
                      <TableRow key={userData._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {userData.name?.charAt(0) || "?"}
                            </div>
                            <div className="flex flex-col">
                              <span>{userData.name || "Anonymous"}</span>
                              <span className="text-[10px] text-muted-foreground font-mono" title="Convex ID">{userData._id}</span>
                              <span className="text-[10px] text-primary/60 font-mono" title="Clerk ID">{userData.tokenIdentifier}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{userData.email || "No email"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={userData.subscriptionTier === "interview_sprint" ? "default" : userData.subscriptionTier === "single_scan" ? "outline" : "secondary"}
                            className="capitalize"
                          >
                            {(userData.subscriptionTier || "free").replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {userData.credits ?? 1}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <Badge variant={userData.resumeCount > 0 ? "default" : "secondary"} className="w-fit">
                              {userData.resumeCount || 0} scans
                            </Badge>
                            {userData.freeTrialUsed && (
                              <span className="text-[10px] text-orange-500 mt-1">Free trial used</span>
                            )}
                            {userData.lastScanDate && (
                              <span className="text-[10px] text-muted-foreground mt-1">
                                Last: {new Date(userData.lastScanDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {new Date(userData._creationTime).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(userData._creationTime).toLocaleTimeString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setHistoryUser({ 
                                id: userData.tokenIdentifier, 
                                name: userData.name || "User",
                                email: userData.email 
                              })}
                              title="View Payment History"
                            >
                              <Receipt className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(userData)}>
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(userData._id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No users found matching "{searchTerm}".
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Manually update subscription and credits for {editingUser?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Plan
              </Label>
              <Select 
                value={editForm.plan} 
                onValueChange={(val) => setEditForm({...editForm, plan: val})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="single_scan">Single Scan</SelectItem>
                  <SelectItem value="interview_sprint">Interview Sprint</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right">
                Credits
              </Label>
              <Input
                id="credits"
                type="number"
                value={editForm.credits}
                onChange={(e) => setEditForm({...editForm, credits: parseInt(e.target.value) || 0})}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
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
    </div>
  );
}