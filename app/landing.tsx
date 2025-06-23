"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Link2, User, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Share Secrets. Temporarily. Securely.
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Confidential messages that vanish forever after one view or set
            expiration.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <Link href="/secret/create">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
              >
                Create a Secret
              </Button>
            </Link>
            <Link href="/secret/create">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-400 text-blue-200 hover:bg-blue-800"
              >
                Try It Now
              </Button>
            </Link>
          </div>
          {/* Email Capture Form */}
          <form
            className="flex flex-col md:flex-row gap-2 justify-center mb-8"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you! We will notify you.");
            }}
          >
            <input
              type="email"
              required
              placeholder="Enter your email for updates"
              className="px-4 py-2 rounded-l-md text-black focus:outline-none w-64"
            />
            <Button
              type="submit"
              className="rounded-r-md bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Notify Me
            </Button>
          </form>
          {/* Visual Element */}
          <div className="flex justify-center">
            <img
              src="/disappearing-message.svg"
              alt="Message disappears after reading"
              className="w-64 h-48 object-contain animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white/5">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <Eye className="w-10 h-10 mb-4 text-blue-400" />
              <span className="font-semibold mb-2">Step 1</span>
              <p>Enter your secret text.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <Shield className="w-10 h-10 mb-4 text-blue-400" />
              <span className="font-semibold mb-2">Step 2</span>
              <p>
                Choose visibility settings (one-time view, expiration time).
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <Lock className="w-10 h-10 mb-4 text-blue-400" />
              <span className="font-semibold mb-2">Step 3</span>
              <p>Optional: Add password protection.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <Link2 className="w-10 h-10 mb-4 text-blue-400" />
              <span className="font-semibold mb-2">Step 4</span>
              <p>Share the unique link with your recipient.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <Eye className="w-10 h-10 mb-4 text-blue-400" />
              <span className="font-semibold mb-2">One-Time Access</span>
              <p>Ensure secrets disappear after being read once.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <Shield className="w-10 h-10 mb-4 text-blue-400" />
              <span className="font-semibold mb-2">Expiration Controls</span>
              <p>Auto-delete secrets after a set time (1h, 1d, 1w).</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <Lock className="w-10 h-10 mb-4 text-blue-400" />
              <span className="font-semibold mb-2">Password Protection</span>
              <p>
                Add another layer of security by requiring a password to view.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <Link2 className="w-10 h-10 mb-4 text-blue-400" />
              <span className="font-semibold mb-2">Unique Shareable Links</span>
              <p>Easily copy and send a secure URL.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <User className="w-10 h-10 mb-4 text-blue-400" />
              <span className="font-semibold mb-2">User Dashboard</span>
              <p>Manage and monitor your own secrets in a secure area.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security & Privacy Assurance */}
      <section className="py-16 px-4 bg-white/5">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Security & Privacy
        </h2>
        <div className="flex flex-col items-center mb-6">
          <div className="flex gap-6 mb-4">
            <Shield
              className="w-10 h-10 text-green-400"
              title="End-to-end Encryption"
            />
            <Lock
              className="w-10 h-10 text-green-400"
              title="Data Protection"
            />
            <img
              src="/badge-ssl.svg"
              alt="SSL Secured"
              className="w-10 h-10"
              title="SSL Secured"
            />
            <img
              src="/badge-gdpr.svg"
              alt="GDPR Compliant"
              className="w-10 h-10"
              title="GDPR Compliant"
            />
          </div>
          <span className="text-sm text-green-300">
            Your secrets are protected with industry-leading security standards.
          </span>
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-4 text-lg">
          <p>No secrets are stored longer than necessary.</p>
          <p>Data is encrypted in transit and at rest.</p>
          <p>All secrets are destroyed after viewing or expiration.</p>
          <p>Privacy-first design with zero tracking.</p>
        </div>
      </section>

      {/* Testimonials / Trust Signals */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Trusted by Thousands
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-4xl mx-auto mb-12">
          <div className="flex flex-col items-center">
            <Star className="w-10 h-10 text-yellow-400 mb-2" />
            <span className="text-2xl font-bold">10,000+</span>
            <span className="text-lg">Secrets shared securely</span>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-10 h-10 text-yellow-400 mb-2" />
            <span className="text-2xl font-bold">
              Engineers, HR teams, Journalists
            </span>
            <span className="text-lg">use our platform</span>
          </div>
        </div>
        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <p className="italic mb-4">
                “The easiest way to share sensitive info. I use it every week!”
              </p>
              <span className="font-semibold">— Alex, Software Engineer</span>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <p className="italic mb-4">
                “Our HR team trusts this for onboarding credentials. Fast and
                secure.”
              </p>
              <span className="font-semibold">— Priya, HR Manager</span>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-none">
            <CardContent className="flex flex-col items-center py-8">
              <p className="italic mb-4">
                “A must-have for journalists sharing confidential sources.”
              </p>
              <span className="font-semibold">— Sam, Journalist</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Authentication Callout */}
      <section className="py-16 px-4 bg-white/5">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Sign Up?</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-4xl mx-auto">
          <ul className="list-disc text-left space-y-2 text-lg">
            <li>Manage multiple secrets</li>
            <li>Dashboard access</li>
            <li>Secret search and status monitoring</li>
          </ul>
          <div className="flex flex-col gap-4">
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
              >
                Sign Up for Free
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-400 text-blue-200 hover:bg-blue-800"
              >
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-blue-950 text-blue-200 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-lg">Share a Secret Chit</span>
            <div className="flex gap-4 text-sm">
              <Link href="/about">About</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <a
                href="https://github.com/Shashwat2104/Secure-Secret-Sharing-Platform"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <a href="mailto:support@secretchit.com" className="underline">
              Contact
            </a>
            {/* Social icons can be added here */}
          </div>
        </div>
      </footer>
    </div>
  );
}
