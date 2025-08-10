import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, UserX, Clock, Wifi, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  phoneNumber: string;
  packageName: string;
  timeRemaining: number; // in minutes
  isOnline: boolean;
  activatedAt: string;
  totalPaid: number;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      phoneNumber: "0796286263",
      packageName: "Basic 8hrs - 10Mbps",
      timeRemaining: 347,
      isOnline: true,
      activatedAt: "2024-01-15 14:30",
      totalPaid: 20
    },
    {
      id: "2", 
      phoneNumber: "0712345678",
      packageName: "Premium 12hrs - 25Mbps",
      timeRemaining: 0,
      isOnline: false,
      activatedAt: "2024-01-15 09:15",
      totalPaid: 50
    },
    {
      id: "3",
      phoneNumber: "0798765432",
      packageName: "Standard 6hrs - 15Mbps",
      timeRemaining: 156,
      isOnline: true,
      activatedAt: "2024-01-15 16:45",
      totalPaid: 35
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.isOnline && user.timeRemaining > 0) {
            const newTimeRemaining = user.timeRemaining - 1;
            if (newTimeRemaining <= 0) {
              toast({
                title: "User Session Expired",
                description: `User ${user.phoneNumber} has been disconnected`,
              });
              return { ...user, timeRemaining: 0, isOnline: false };
            }
            return { ...user, timeRemaining: newTimeRemaining };
          }
          return user;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [toast]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const disconnectUser = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isOnline: false, timeRemaining: 0 } : user
      )
    );
    toast({
      title: "User Disconnected",
      description: "User has been forcefully disconnected",
    });
  };

  const filteredUsers = users.filter(user =>
    user.phoneNumber.includes(searchTerm) ||
    user.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            User Management
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Monitor and manage active users and their internet sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by phone number or package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Phone Number</TableHead>
                  <TableHead className="text-muted-foreground">Package</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Time Remaining</TableHead>
                  <TableHead className="text-muted-foreground">Total Paid</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      {user.phoneNumber}
                    </TableCell>
                    <TableCell className="text-foreground">{user.packageName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.isOnline ? "default" : "secondary"}
                        className={user.isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                      >
                        <Wifi className="mr-1 h-3 w-3" />
                        {user.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {user.timeRemaining > 0 ? (
                        <span className="flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-primary" />
                          {formatTime(user.timeRemaining)}
                        </span>
                      ) : (
                        <span className="text-red-500">Expired</span>
                      )}
                    </TableCell>
                    <TableCell className="text-foreground">
                      KShs {user.totalPaid}
                    </TableCell>
                    <TableCell>
                      {user.isOnline && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => disconnectUser(user.id)}
                        >
                          <UserX className="mr-1 h-3 w-3" />
                          Disconnect
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};