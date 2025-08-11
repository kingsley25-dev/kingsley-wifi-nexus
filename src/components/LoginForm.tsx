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
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const raw = emailOrUsername.trim();
      const isAdminAlias = raw.toLowerCase() === "admin" && password === "kingsley123";
      const mappedEmail = isAdminAlias ? "kingsleycorp25@gmail.com" : raw;
      const mappedPassword = isAdminAlias ? "kingsley123" : password;

      // Sign in with Supabase
      let { data, error } = await supabase.auth.signInWithPassword({
        email: mappedEmail,
        password: mappedPassword,
      });

      // If the account doesn't exist yet and the user used the admin alias, try to create it
      if (error && isAdminAlias) {
        const redirectUrl = `${window.location.origin}/`;
        const signUpRes = await supabase.auth.signUp({
          email: mappedEmail,
          password: mappedPassword,
          options: { emailRedirectTo: redirectUrl },
        });
        if (signUpRes.error) throw signUpRes.error;
        // Ask the user to check email only if confirmation is enabled
        toast({ title: "Admin User Created", description: "If email confirmation is enabled, please confirm the email before logging in." });
        // Try sign-in again (in case confirmation is disabled)
        const retry = await supabase.auth.signInWithPassword({ email: mappedEmail, password: mappedPassword });
        data = retry.data; error = retry.error;
      }

      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error("No user returned");

      // Ensure admin mapping exists
      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!adminRow) {
        await supabase.from('admin_users').insert({
          user_id: user.id,
          username: isAdminAlias ? 'admin' : (mappedEmail.split('@')[0] || 'admin'),
          role: 'admin',
        });
      }

      toast({ title: "Login Successful", description: "Welcome to Kingsley Techlab Admin Portal" });
      onLogin();
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
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
                <Label htmlFor="username" className="text-foreground">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  className="bg-input border-border text-foreground"
                  placeholder="admin or kingsleycorp25@gmail.com"
                  autoComplete="username"
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
                  placeholder="Enter password"
                  autoComplete="current-password"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
