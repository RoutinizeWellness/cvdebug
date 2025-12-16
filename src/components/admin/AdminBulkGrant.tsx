import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface AdminBulkGrantProps {
  bulkText: string;
  setBulkText: (value: string) => void;
  handleBulkGrant: () => void;
  isBulkProcessing: boolean;
  bulkResult: string | null;
}

export function AdminBulkGrant({
  bulkText,
  setBulkText,
  handleBulkGrant,
  isBulkProcessing,
  bulkResult
}: AdminBulkGrantProps) {
  return (
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
  );
}
