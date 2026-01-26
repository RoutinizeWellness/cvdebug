import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Receipt, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";

interface AdminUserTableProps {
  users: any[] | undefined;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleEditClick: (user: any) => void;
  handleDelete: (userId: Id<"users">) => void;
  setHistoryUser: (user: {id: string, name: string, email?: string}) => void;
}

export function AdminUserTable({
  users,
  searchTerm,
  setSearchTerm,
  handleEditClick,
  handleDelete,
  setHistoryUser
}: AdminUserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Ensure current page is valid when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Registered Users</CardTitle>
          <p className="text-xs text-muted-foreground">
            {users ? `${users.length} total users` : "Loading..."} 
            {searchTerm && ` • ${filteredUsers.length} matches found`}
          </p>
        </div>
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
          <div className="flex flex-col gap-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((userData: any) => {
                    const tier = userData.subscriptionTier || "free";
                    const hasActiveSprint = userData.sprintExpiresAt && userData.sprintExpiresAt > Date.now();
                    
                    return (
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
                            variant={
                              tier === "interview_sprint" ? "default" :
                              tier === "single_scan" ? "outline" :
                              tier === "single_debug_fix" ? "outline" :
                              "secondary"
                            }
                            className={
                              tier === "single_debug_fix" ? "bg-amber-50 text-amber-700 border-amber-300" :
                              tier === "single_scan" ? "bg-orange-50 text-orange-700 border-orange-300" :
                              ""
                            }
                          >
                            {tier === "interview_sprint" ? "Sprint 7 Días" :
                             tier === "single_scan" ? "Pase 24h" :
                             tier === "single_debug_fix" ? "Arreglo Rápido" :
                             "Free Preview"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {hasActiveSprint ? (
                            <Badge variant="default" className="bg-green-600">
                              Sprint Activo
                            </Badge>
                          ) : tier === "single_debug_fix" ? (
                            userData.singleDebugFixUsed ? (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                Usado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                                Activo
                              </Badge>
                            )
                          ) : tier === "single_scan" ? (
                            userData.credits > 0 ? (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                                Activo ({userData.credits} créditos)
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                Sin créditos
                              </Badge>
                            )
                          ) : (
                            <Badge variant="secondary">
                              Free
                            </Badge>
                          )}
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
                              <Receipt className="h-4 w-4 text-[#1E293B]" />
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
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found matching "{searchTerm}".
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}