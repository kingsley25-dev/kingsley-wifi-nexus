import { useEffect, useState } from "react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { UserPortal } from "@/components/UserPortal";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { Wifi, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'user' | 'adminLogin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const authed = !!data.session;
      setIsAdminLoggedIn(authed);
      if (authed) setCurrentView('admin');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const authed = !!session;
      setIsAdminLoggedIn(authed);
      if (authed) setCurrentView('admin');
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  if (currentView === 'adminLogin') {
    return <LoginForm onLogin={handleAdminLogin} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'admin' && isAdminLoggedIn) {
    return <AdminDashboard onLogout={async () => {
      await supabase.auth.signOut();
      setIsAdminLoggedIn(false);
      setCurrentView('home');
    }} />;
  }

  if (currentView === 'user') {
    return <UserPortal onBack={() => setCurrentView('home')} />;
  }

  return (
    <main className="min-h-screen bg-gradient-primary">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-kingsley-deep-navy via-kingsley-navy-variant to-kingsley-muted-navy opacity-90"></div>
        <div className="relative container mx-auto px-4 safe-px py-16 md:py-20">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center mb-6">
              <Wifi className="h-12 w-12 sm:h-16 sm:w-16 text-primary mr-4" />
              <h1 className="text-fluid-title font-bold bg-gradient-gold bg-clip-text text-transparent text-balance leading-tight">
                Kingsley Techlab WiFi Billing System
              </h1>
            </div>
              <p className="text-fluid-body text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
                Premium WiFi billing system – manage internet packages with ease and efficiency
              </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setCurrentView('adminLogin')}
                className="bg-gradient-gold hover:bg-gradient-accent text-kingsley-deep-navy font-semibold px-6 sm:px-8 py-3 text-base sm:text-lg shadow-gold w-full sm:w-auto"
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Admin Portal
              </Button>
              <Button 
                onClick={() => setCurrentView('user')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                <Wifi className="mr-2 h-5 w-5" />
                Buy Internet Package
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
            <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-lg border border-border shadow-navy">
              <div className="h-12 w-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                <Wifi className="h-6 w-6 text-kingsley-deep-navy" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">High-Speed Internet</h3>
              <p className="text-muted-foreground">Reliable internet packages with speeds up to 50Mbps</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-lg border border-border shadow-navy">
              <div className="h-12 w-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-kingsley-deep-navy" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Secure Access</h3>
              <p className="text-muted-foreground">6-digit activation codes for secure internet access</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-lg border border-border shadow-navy">
              <div className="h-12 w-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                <div className="text-kingsley-deep-navy font-bold text-lg">24/7</div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">24/7 Service</h3>
              <p className="text-muted-foreground">Round-the-clock internet service and support</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
