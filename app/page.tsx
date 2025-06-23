"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Home() {
  const { user } = useAuth();
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [oneTimeAccess, setOneTimeAccess] = useState(false);
  const [expirationOption, setExpirationOption] = useState("24h");
  const [secretUrl, setSecretUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [customExpiration, setCustomExpiration] = useState("");

  const createSecretMutation = trpc.secrets.create.useMutation({
    onSuccess: (data) => {
      const url = `${window.location.origin}/secret/${data.id}`;
      setSecretUrl(url);
      toast.success("Secret created successfully!");
      // Clear form
      setSecret("");
      setPassword("");
      setOneTimeAccess(false);
      setExpirationOption("24h");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async () => {
    if (!secret.trim()) {
      toast.error("Please enter a secret");
      return;
    }

    // Generate a random 256-bit key and IV
    const keyBytes = window.crypto.getRandomValues(new Uint8Array(32));
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const keyHex = Array.from(keyBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const ivHex = Array.from(iv)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Encrypt the secret using AES-GCM
    const enc = new TextEncoder();
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );
    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      enc.encode(secret)
    );
    const ciphertext = Buffer.from(ciphertextBuffer).toString("base64");

    let expiresAt: Date | undefined;
    if (expirationOption === "custom") {
      if (!customExpiration) {
        toast.error("Please enter a custom expiration date and time");
        return;
      }
      const customDate = new Date(customExpiration);
      if (isNaN(customDate.getTime()) || customDate < new Date()) {
        toast.error("Please enter a valid future date and time");
        return;
      }
      expiresAt = customDate;
    } else if (expirationOption !== "never") {
      const now = new Date();
      switch (expirationOption) {
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

    createSecretMutation.mutate(
      {
        content: JSON.stringify({ ciphertext, iv: ivHex }),
        password: password || undefined,
        expiresAt,
        oneTimeAccess,
        user_id: user?.id || undefined, // <-- Add user_id if authenticated
      },
      {
        onSuccess: (data) => {
          // Append key as fragment
          const url = `${window.location.origin}/secret/${data.id}#${keyHex}`;
          setSecretUrl(url);
          toast.success("Secret created successfully!");
          setSecret("");
          setPassword("");
          setOneTimeAccess(false);
          setExpirationOption("24h");
        },
      }
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secretUrl);
      setCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="min-h-screen">
      {/* <Navigation /> */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Share Secrets Securely
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Send sensitive information with confidence. End-to-end encryption,
            self-destructing messages, and complete control over who sees what
            you share.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            {/* <Shield className="h-12 w-12 text-blue-400 mb-4" /> */}
            <h3 className="text-lg font-semibold text-white mb-2">
              End-to-End Encrypted
            </h3>
            <p className="text-gray-300 text-sm">
              Your secrets are encrypted before they leave your device
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            {/* <Eye className="h-12 w-12 text-purple-400 mb-4" /> */}
            <h3 className="text-lg font-semibold text-white mb-2">
              One-Time Access
            </h3>
            <p className="text-gray-300 text-sm">
              Secrets self-destruct after being viewed once
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            {/* <Clock className="h-12 w-12 text-green-400 mb-4" /> */}
            <h3 className="text-lg font-semibold text-white mb-2">
              Auto-Expiring
            </h3>
            <p className="text-gray-300 text-sm">
              Set custom expiration times for automatic cleanup
            </p>
          </div>
        </div>

        {/* Create Secret Form */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              {/* <Lock className="h-6 w-6 text-blue-400" /> */}
              Create a Secret
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label
                htmlFor="secret"
                className="text-white text-base font-medium"
              >
                Your Secret
              </Label>
              <Textarea
                id="secret"
                placeholder="Enter your sensitive information here..."
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="mt-2 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 transition-colors min-h-[120px]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="password"
                  className="text-white text-base font-medium"
                >
                  Password Protection (Optional)
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <Label className="text-white text-base font-medium">
                  Expiration
                </Label>
                <Select
                  value={expirationOption}
                  onValueChange={setExpirationOption}
                >
                  <SelectTrigger className="mt-2 bg-white/5 border-white/20 text-white focus:border-blue-400">
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
                {expirationOption === "custom" && (
                  <Input
                    type="datetime-local"
                    value={customExpiration}
                    onChange={(e) => setCustomExpiration(e.target.value)}
                    className="mt-2 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 transition-colors"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <Switch
                id="one-time"
                checked={oneTimeAccess}
                onCheckedChange={setOneTimeAccess}
                className="data-[state=checked]:bg-blue-600"
              />
              <div>
                <Label htmlFor="one-time" className="text-white font-medium">
                  One-Time Access
                </Label>
                <p className="text-gray-300 text-sm">
                  Secret will be destroyed after first view
                </p>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={createSecretMutation.isLoading || !secret.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
            >
              {createSecretMutation.isLoading
                ? "Creating..."
                : "Create Secret Link"}
            </Button>
          </CardContent>
        </Card>

        {/* Success Message */}
        {secretUrl && (
          <Card className="mt-8 bg-green-500/10 backdrop-blur-lg border-green-400/30 shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                {/* <Check className="h-5 w-5 text-green-400" /> */}
                <h3 className="text-lg font-semibold text-green-400">
                  Secret Created Successfully!
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                Share this URL with the intended recipient. Remember, this link
                will only work once if you enabled one-time access.
              </p>
              <div className="flex gap-2">
                <Input
                  value={secretUrl}
                  readOnly
                  className="bg-white/5 border-white/20 text-white"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA for Authentication */}
        {!user && (
          <div className="text-center mt-12 p-8 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20">
            <h3 className="text-xl font-semibold text-white mb-2">
              Want to manage your secrets?
            </h3>
            <p className="text-gray-300 mb-4">
              Create an account to track, manage, and delete your shared
              secrets.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign Up Free
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
