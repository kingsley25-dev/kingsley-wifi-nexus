import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  onLogin: () => void;
  onBack: () => void;
}

export const LoginForm = ({ onLogin, onBack }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("kingsleycorp25@gmail.com");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin credentials (in a real app, this would be more secure)
    if (username === "admin" && password === "kingsley123") {
      toast({
        title: "Login Successful",
        description: "Welcome to Kingsley Techlab Admin Portal",
      });
      onLogin();
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleMagicLink = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      toast({
        title: "Magic link sent",
        description: `Check ${email} to continue.`,
      });
    } catch (err: any) {
      toast({
        title: "Sign-in failed",
        description: err?.message ?? "Could not send magic link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-primary hover:text-accent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-gold rounded-full flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-kingsley-deep-navy" />
              </div>
            </div>
            <CardTitle className="text-2xl text-foreground">Admin Login</CardTitle>
            <CardDescription className="text-muted-foreground">
              Access Kingsley Techlab Admin Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-input border-border text-foreground"
                  placeholder="Enter admin username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input border-border text-foreground"
                  placeholder="Enter admin password"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-gold hover:bg-gradient-accent text-kingsley-deep-navy font-semibold shadow-gold"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-4 space-y-3">
              <div className="p-4 bg-muted/20 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  Admin email login (recommended for live writes):
                </p>
                <div className="mt-2 flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border text-foreground flex-1"
                    placeholder="admin@example.com"
                  />
                  <Button onClick={handleMagicLink} disabled={isLoading} className="bg-primary text-primary-foreground">
                    Send magic link
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Only authorized admins can write to the database.
                </p>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Demo Credentials:<br />
                  Username: <span className="text-primary font-medium">admin</span><br />
                  Password: <span className="text-primary font-medium">kingsley123</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};