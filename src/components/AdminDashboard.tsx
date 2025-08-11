import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Package, Settings, Activity } from "lucide-react";
import { UserManagement } from "./admin/UserManagement";
import { PackageManagement } from "./admin/PackageManagement";
import { SystemStats } from "./admin/SystemStats";
import { ActivationCodes } from "./admin/ActivationCodes";

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeUsers] = useState(23);
  const [totalRevenue] = useState(45600);
  const [todaysSales] = useState(8);

  return (
    <main className="min-h-screen bg-gradient-primary">
      <header className="border-b border-border bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                KINGSLEY TECHLAB
              </h1>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Admin Portal
              </Badge>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">KShs {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{todaysSales}</div>
              <p className="text-xs text-muted-foreground">Packages sold today</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
              <Settings className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Online</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-secondary/50 backdrop-blur-sm border border-border flex flex-wrap gap-2 overflow-x-auto">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full sm:w-auto">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="packages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full sm:w-auto">
              <Package className="mr-2 h-4 w-4" />
              Package Management
            </TabsTrigger>
            <TabsTrigger value="codes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full sm:w-auto">
              <Settings className="mr-2 h-4 w-4" />
              Activation Codes
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-full sm:w-auto">
              <Activity className="mr-2 h-4 w-4" />
              System Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="packages">
            <PackageManagement />
          </TabsContent>

          <TabsContent value="codes">
            <ActivationCodes />
          </TabsContent>

          <TabsContent value="stats">
            <SystemStats />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};