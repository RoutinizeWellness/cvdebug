import { useQuery } from "convex/react";

// Cast to any to avoid deep type instantiation errors
import { api } from "@/convex/_generated/api";
const apiAny: any = api;

import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminWaitlist() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // We don't block the query here, the backend handles security, 
  // but we can conditionally render or redirect on the client side too.
  const waitlist = useQuery(apiAny.waitlist.getWaitlist);

  useEffect(() => {
    if (!authLoading && (!user || user.email !== "tiniboti@gmail.com")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.email !== "tiniboti@gmail.com") {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Waitlist Admin</h1>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Subscribers</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              Total: {waitlist?.length || 0}
            </span>
          </div>
          
          {!waitlist ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : waitlist.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No subscribers yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlist.map((entry: any) => (
                  <TableRow key={entry._id}>
                    <TableCell className="font-medium">{entry.email}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(entry._creationTime).toLocaleDateString('es-ES')} {new Date(entry._creationTime).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}