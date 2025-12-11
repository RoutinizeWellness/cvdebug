import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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
import { Loader2, ShieldAlert, Pencil, Trash2, Save, X } from "lucide-react";
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
import { Id } from "@/convex/_generated/dataModel";

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // We can't conditionally call hooks, but we can handle the error/loading states in render
  const shouldFetch = !authLoading && user?.email === "tiniboti@gmail.com";
  const users = useQuery(api.admin.getUsers, shouldFetch ? {} : "skip");
  const stats = useQuery(api.admin.getAdminStats, shouldFetch ? {} : "skip");
  const updateUserPlan = useMutation(api.admin.updateUserPlan);
  const deleteUser = useMutation(api.admin.deleteUser);
  const fixInconsistentUsers = useMutation(api.admin.fixInconsistentUsers);

  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    plan: "free",
    credits: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

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
        plan: editForm.plan as "free" | "single_scan" | "bulk_pack",
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

  const handleDelete = async (userId: Id<"users">) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser({ userId });
      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

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
          <div className="flex items-center gap-2">
             <Button variant="outline" onClick={handleFixInconsistent} disabled={isFixing}>
                {isFixing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                Auto-Fix Inconsistent Users
             </Button>
          </div>
        </div>

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
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
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
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userData) => (
                      <TableRow key={userData._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {userData.name?.charAt(0) || "?"}
                            </div>
                            <div className="flex flex-col">
                              <span>{userData.name || "Anonymous"}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">{userData._id}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{userData.email || "No email"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={userData.subscriptionTier === "bulk_pack" ? "default" : userData.subscriptionTier === "single_scan" ? "outline" : "secondary"}
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
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found.
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
                  <SelectItem value="bulk_pack">Bulk Pack</SelectItem>
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
    </div>
  );
}