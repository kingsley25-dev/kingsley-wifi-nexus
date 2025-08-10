import { useState } from "react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { UserPortal } from "@/components/UserPortal";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { Wifi, ShieldCheck } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'user' | 'adminLogin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin');
  };

  if (currentView === 'adminLogin') {
    return <LoginForm onLogin={handleAdminLogin} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'admin' && isAdminLoggedIn) {
    return <AdminDashboard onLogout={() => {
      setIsAdminLoggedIn(false);
      setCurrentView('home');
    }} />;
  }

  if (currentView === 'user') {
    return <UserPortal onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-kingsley-deep-navy via-kingsley-navy-variant to-kingsley-muted-navy opacity-90"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Wifi className="h-16 w-16 text-primary mr-4" />
              <h1 className="text-6xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                KINGSLEY TECHLAB
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Premium WiFi Billing System - Manage your internet packages with ease and efficiency
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setCurrentView('adminLogin')}
                className="bg-gradient-gold hover:bg-gradient-accent text-kingsley-deep-navy font-semibold px-8 py-3 text-lg shadow-gold"
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Admin Portal
              </Button>
              <Button 
                onClick={() => setCurrentView('user')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg"
              >
                <Wifi className="mr-2 h-5 w-5" />
                Buy Internet Package
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border shadow-navy">
              <div className="h-12 w-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                <Wifi className="h-6 w-6 text-kingsley-deep-navy" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">High-Speed Internet</h3>
              <p className="text-muted-foreground">Reliable internet packages with speeds up to 50Mbps</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border shadow-navy">
              <div className="h-12 w-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-kingsley-deep-navy" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Secure Access</h3>
              <p className="text-muted-foreground">6-digit activation codes for secure internet access</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border shadow-navy">
              <div className="h-12 w-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                <div className="text-kingsley-deep-navy font-bold text-lg">24/7</div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">24/7 Service</h3>
              <p className="text-muted-foreground">Round-the-clock internet service and support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
