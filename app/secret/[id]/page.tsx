"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Eye, AlertTriangle, Copy, Check, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ViewSecret() {
  const params = useParams();
  const secretId = params && typeof params.id === "string" ? params.id : "";
  const [password, setPassword] = useState("");
  const [secretContent, setSecretContent] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [isOneTime, setIsOneTime] = useState(false);
  const [copied, setCopied] = useState(false);
  const [decryptError, setDecryptError] = useState("");

  const viewSecretMutation = trpc.secrets.view.useMutation({
    onSuccess: (data) => {
      setSecretContent(data.content);
      setIsRevealed(true);
      setIsOneTime(data.oneTimeAccess);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleRevealSecret = async () => {
    // Get key from URL fragment
    const fragment = window.location.hash.slice(1);
    if (!fragment || fragment.length !== 64) {
      setDecryptError("Missing or invalid decryption key in URL.");
      return;
    }
    // Fetch ciphertext from server
    viewSecretMutation.mutate(
      {
        secretId,
        password: password || undefined,
      },
      {
        onSuccess: async (data) => {
          try {
            const { ciphertext, iv } = JSON.parse(data.content);
            const keyBytes = new Uint8Array(
              fragment
                ?.match(/.{1,2}/g)
                ?.map((byte: string) => parseInt(byte, 16)) ?? []
            );
            const ivBytes = new Uint8Array(
              iv?.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) ??
                []
            );
            const cryptoKey = await window.crypto.subtle.importKey(
              "raw",
              keyBytes,
              { name: "AES-GCM" },
              false,
              ["decrypt"]
            );
            const decryptedBuffer = await window.crypto.subtle.decrypt(
              { name: "AES-GCM", iv: ivBytes },
              cryptoKey,
              Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))
            );
            setSecretContent(new TextDecoder().decode(decryptedBuffer));
            setIsRevealed(true);
            setIsOneTime(data.oneTimeAccess);
          } catch (err) {
            setDecryptError(
              "Failed to decrypt secret. The link or key may be invalid."
            );
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secretContent);
      setCopied(true);
      toast.success("Secret copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy secret");
    }
  };

  if (isRevealed) {
    return (
      <div className="min-h-screen">
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Secret Revealed
            </h1>
            <p className="text-gray-300">
              {isOneTime
                ? "This secret has been destroyed and cannot be viewed again."
                : "Handle with care."}
            </p>
          </div>

          {isOneTime && (
            <Alert className="mb-6 bg-orange-500/10 border-orange-400/30">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <AlertDescription className="text-orange-300">
                This was a one-time secret. It has been permanently deleted and
                cannot be accessed again.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-400" />
                Your Secret
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <pre className="text-white whitespace-pre-wrap break-words font-mono text-sm">
                    {secretContent}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Secret
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Remember to securely handle this information and delete it when no
              longer needed.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Lock className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Protected Secret
          </h1>
          <p className="text-gray-300">
            Enter the password to reveal the secret
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white text-center">
              Unlock Secret
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label
                htmlFor="password"
                className="text-white text-base font-medium"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleRevealSecret()}
                className="mt-2 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 transition-colors"
              />
            </div>

            <Button
              onClick={handleRevealSecret}
              disabled={viewSecretMutation.isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
            >
              {viewSecretMutation.isLoading ? "Revealing..." : "Reveal Secret"}
            </Button>

            {decryptError && (
              <Alert className="bg-red-500/10 border-red-400/30">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {decryptError}
                </AlertDescription>
              </Alert>
            )}

            <Alert className="bg-yellow-500/10 border-yellow-400/30">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300 text-sm">
                This secret may be configured for one-time access. It will be
                destroyed after viewing.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
