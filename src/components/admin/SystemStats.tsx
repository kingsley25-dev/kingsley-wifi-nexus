import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, TrendingUp, Users, DollarSign, Wifi } from "lucide-react";

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  todayRevenue: number;
  systemUptime: number;
  bandwidthUsage: number;
  packagesSOld: number;
  serverLoad: number;
}

export const SystemStats = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 156,
    activeUsers: 23,
    totalRevenue: 45600,
    todayRevenue: 380,
    systemUptime: 99.8,
    bandwidthUsage: 73,
    packagesSOld: 89,
    serverLoad: 45
  });

  const [realtimeData, setRealtimeData] = useState({
    currentBandwidth: 125,
    peakBandwidth: 250,
    connectionsPerSecond: 12,
    averageSessionTime: 4.2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: Math.max(15, prev.activeUsers + Math.floor(Math.random() * 6) - 3),
        bandwidthUsage: Math.max(50, Math.min(95, prev.bandwidthUsage + Math.floor(Math.random() * 10) - 5)),
        serverLoad: Math.max(20, Math.min(80, prev.serverLoad + Math.floor(Math.random() * 10) - 5))
      }));

      setRealtimeData(prev => ({
        ...prev,
        currentBandwidth: Math.max(80, Math.min(200, prev.currentBandwidth + Math.floor(Math.random() * 20) - 10)),
        connectionsPerSecond: Math.max(5, prev.connectionsPerSecond + Math.floor(Math.random() * 6) - 3)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return `KShs ${amount.toLocaleString()}`;
  };

  const formatUptime = (percentage: number) => {
    const days = Math.floor(percentage * 365 / 100);
    return `${percentage}% (${days} days)`;
  };

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.activeUsers}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={(stats.activeUsers / stats.totalUsers) * 100} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {stats.totalUsers} total users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(stats.todayRevenue)}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+12.5% from yesterday</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total: {formatCurrency(stats.totalRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bandwidth Usage</CardTitle>
            <Wifi className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.bandwidthUsage}%</div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={stats.bandwidthUsage} className="flex-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {realtimeData.currentBandwidth}MB/{realtimeData.peakBandwidth}MB peak
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Server Load</CardTitle>
            <Server className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.serverLoad}%</div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress 
                value={stats.serverLoad} 
                className="flex-1"
              />
              <Badge 
                variant={stats.serverLoad < 60 ? "default" : stats.serverLoad < 80 ? "secondary" : "destructive"}
                className={
                  stats.serverLoad < 60 
                    ? "bg-green-500 text-white" 
                    : stats.serverLoad < 80 
                    ? "bg-yellow-500 text-white" 
                    : "bg-red-500 text-white"
                }
              >
                {stats.serverLoad < 60 ? "Good" : stats.serverLoad < 80 ? "Moderate" : "High"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            System Performance
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Real-time system metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">System Uptime</span>
                <span className="text-sm font-medium text-foreground">{formatUptime(stats.systemUptime)}</span>
              </div>
              <Progress value={stats.systemUptime} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Packages Sold (Month)</span>
                <span className="text-sm font-medium text-foreground">{stats.packagesSOld} packages</span>
              </div>
              <Progress value={(stats.packagesSOld / 100) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Session Time</span>
                <span className="text-sm font-medium text-foreground">{realtimeData.averageSessionTime}h</span>
              </div>
              <Progress value={(realtimeData.averageSessionTime / 8) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Connection Stats */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Wifi className="mr-2 h-5 w-5 text-primary" />
            Live Connection Statistics
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Real-time connection and bandwidth monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Connections/Second</p>
                  <p className="text-2xl font-bold text-foreground">{realtimeData.connectionsPerSecond}</p>
                </div>
                <div className="h-10 w-10 bg-gradient-gold rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-kingsley-deep-navy" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Peak Bandwidth Today</p>
                  <p className="text-2xl font-bold text-foreground">{realtimeData.peakBandwidth} MB</p>
                </div>
                <div className="h-10 w-10 bg-gradient-gold rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-kingsley-deep-navy" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/20 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3">System Health</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Database</span>
                    <Badge className="bg-green-500 text-white">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">API Server</span>
                    <Badge className="bg-green-500 text-white">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payment Gateway</span>
                    <Badge className="bg-green-500 text-white">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email Service</span>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};