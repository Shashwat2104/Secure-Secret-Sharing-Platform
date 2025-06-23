"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Plus, Eye, Clock, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { trpc } from "@/lib/trpc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editSecret, setEditSecret] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editOneTime, setEditOneTime] = useState(false);
  const [editExpiration, setEditExpiration] = useState<string | null>(null);
  const [editCustomExpiration, setEditCustomExpiration] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  const {
    data: secrets,
    isLoading,
    refetch,
  } = trpc.secrets.getUserSecrets.useQuery(
    { userId: user?.id || "" },
    { enabled: !!user }
  );

  const deleteSecretMutation = trpc.secrets.delete.useMutation({
    onSuccess: () => {
      toast.success("Secret deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateSecretMutation = trpc.secrets.update.useMutation({
    onSuccess: () => {
      toast.success("Secret updated successfully");
      setEditOpen(false);
      setEditSecret(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeleteSecret = (secretId: string) => {
    // Use Toastify confirm dialog instead of window.confirm
    toast.info(
      <div>
        <span>Are you sure you want to delete this secret?</span>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "4px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => {
              deleteSecretMutation.mutate({ secretId });
              toast.dismiss();
            }}
          >
            Delete
          </button>
          <button
            style={{
              background: "#374151",
              color: "white",
              border: "none",
              padding: "4px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center",
      }
    );
  };

  const openEditDialog = (secret: any) => {
    setEditSecret(secret);
    setEditContent(secret.content || "");
    setEditPassword("");
    setEditOneTime(secret.one_time_access);
    setEditExpiration(secret.expires_at ? "custom" : "never");
    setEditCustomExpiration(
      secret.expires_at
        ? new Date(secret.expires_at).toISOString().slice(0, 16)
        : ""
    );
    setEditOpen(true);
  };

  const handleUpdateSecret = () => {
    if (!editSecret) return;
    let expiresAt: Date | undefined = undefined;
    if (editExpiration === "custom" && editCustomExpiration) {
      const customDate = new Date(editCustomExpiration);
      if (isNaN(customDate.getTime()) || customDate < new Date()) {
        toast.error("Please enter a valid future date and time");
        return;
      }
      expiresAt = customDate;
    } else if (editExpiration !== "never") {
      const now = new Date();
      switch (editExpiration) {
        case "1h":
          expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
          break;
        case "24h":
          expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case "7d":
          expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
      }
    }
    updateSecretMutation.mutate({
      secretId: editSecret.id,
      content: editContent,
      password: editPassword || undefined,
      expiresAt,
      oneTimeAccess: editOneTime,
    });
  };

  // Filter secrets based on search
  const filteredSecrets = useMemo(() => {
    if (!secrets) return [];
    const q = search.toLowerCase();
    return secrets.filter(
      (secret: any) =>
        secret.id.toLowerCase().includes(q) ||
        (secret.status && secret.status.toLowerCase().includes(q))
    );
  }, [secrets, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">Manage your secure secrets</p>
          </div>
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Secret
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md">
          <Input
            type="text"
            placeholder="Search secrets by ID or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          </div>
        ) : !secrets || secrets.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No secrets yet
              </h3>
              <p className="text-gray-300 mb-6">
                Create your first secure secret to get started
              </p>
              <Button
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Secret
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredSecrets.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                <CardContent className="text-center py-12">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No secrets found
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Try a different search term.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredSecrets.map((secret: any) => (
                <Card
                  key={secret.id}
                  className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">
                        Secret #{secret.id.slice(-8)}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            secret.status === "active"
                              ? "default"
                              : secret.status === "viewed"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            secret.status === "active"
                              ? "bg-green-600 text-white"
                              : secret.status === "viewed"
                              ? "bg-orange-600 text-white"
                              : "bg-red-600 text-white"
                          }
                        >
                          {secret.status === "active" && (
                            <Eye className="h-3 w-3 mr-1" />
                          )}
                          {secret.status === "expired" && (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {secret.status === "viewed" && (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {secret.status.charAt(0).toUpperCase() +
                            secret.status.slice(1)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSecret(secret.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(secret)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Created</p>
                        <p className="text-white">
                          {format(new Date(secret.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      {secret.expires_at && (
                        <div>
                          <p className="text-gray-400">Expires</p>
                          <p className="text-white">
                            {format(new Date(secret.expires_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-400">Access Type</p>
                        <p className="text-white">
                          {secret.one_time_access ? "One-time" : "Multiple"}
                        </p>
                      </div>
                    </div>

                    {secret.status === "active" && (
                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                        <p className="text-blue-300 text-sm font-medium mb-2">
                          Share URL:
                        </p>
                        <code className="text-xs text-blue-200 break-all">
                          {`${window.location.origin}/secret/${secret.id}`}
                        </code>
                      </div>
                    )}

                    {secret.status === "viewed" && (
                      <Alert className="mt-4 bg-orange-500/10 border-orange-400/30">
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                        <AlertDescription className="text-orange-300">
                          This one-time secret has been viewed and destroyed.
                        </AlertDescription>
                      </Alert>
                    )}

                    {secret.status === "expired" && (
                      <Alert className="mt-4 bg-red-500/10 border-red-400/30">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300">
                          This secret has expired and is no longer accessible.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      {/* Edit Secret Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Secret</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label className="text-white">Secret</Label>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            />
            <Label className="text-white">
              Password (leave blank to keep unchanged)
            </Label>
            <Input
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            />
            <Label className="text-white">Expiration</Label>
            <Select
              value={editExpiration || "never"}
              onValueChange={setEditExpiration}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="1h" className="text-white">
                  1 Hour
                </SelectItem>
                <SelectItem value="24h" className="text-white">
                  24 Hours
                </SelectItem>
                <SelectItem value="7d" className="text-white">
                  7 Days
                </SelectItem>
                <SelectItem value="never" className="text-white">
                  Never
                </SelectItem>
                <SelectItem value="custom" className="text-white">
                  Custom...
                </SelectItem>
              </SelectContent>
            </Select>
            {editExpiration === "custom" && (
              <Input
                type="datetime-local"
                value={editCustomExpiration}
                onChange={(e) => setEditCustomExpiration(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              />
            )}
            <div className="flex items-center space-x-3">
              <Switch
                id="edit-one-time"
                checked={editOneTime}
                onCheckedChange={setEditOneTime}
                className="data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="edit-one-time" className="text-white font-medium">
                One-Time Access
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateSecret}
              disabled={updateSecretMutation.isLoading}
            >
              {updateSecretMutation.isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
