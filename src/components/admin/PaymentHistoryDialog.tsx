import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Receipt, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export function PaymentHistoryDialog({ isOpen, onClose, userId, userName }: PaymentHistoryDialogProps) {
  const getPaymentHistory = useAction(api.admin.getUserPaymentHistory);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchHistory();
    } else {
      setData(null);
      setError(null);
    }
  }, [isOpen, userId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPaymentHistory({ customerId: userId });
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch payment history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History: {userName}
          </DialogTitle>
          <DialogDescription>
            Fetching data from Autumn for Customer ID: <span className="font-mono text-xs">{userId}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[200px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Contacting Autumn API...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-red-500">
              <AlertCircle className="h-8 w-8" />
              <p className="text-sm font-medium">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchHistory}>Retry</Button>
            </div>
          ) : data ? (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {data.results && data.results.length > 0 ? (
                  data.results.map((item: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={item.type.includes("error") ? "destructive" : "outline"}>
                            {item.type}
                          </Badge>
                          {item.status && (
                            <span className="text-xs font-mono text-muted-foreground">Status: {item.status}</span>
                          )}
                        </div>
                        
                        {item.data ? (
                          <pre className="text-[10px] bg-muted p-2 rounded overflow-auto max-h-[150px]">
                            {JSON.stringify(item.data, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            {item.text || item.error || "No data returned"}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No payment records found for this user.
                  </div>
                )}
                
                {/* Fallback/Debug Info if API fails */}
                <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground">
                  <p className="font-semibold mb-1">Debug Info:</p>
                  <p>If you see 404 errors, it means the Autumn API could not find the customer or the endpoint is incorrect. Ensure the user has actually initiated a checkout session.</p>
                </div>
              </div>
            </ScrollArea>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
