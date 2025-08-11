import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Key, Mail, Copy, CheckCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActivationCodeView {
  id: string;
  code: string;
  phoneNumber: string;
  packageName: string;
  price: number;
  generatedAt: string;
  isUsed: boolean;
  usedAt?: string;
}

interface PackageOption {
  id: string;
  name: string;
  price: number;
  duration_hours: number | null;
  duration_days: number | null;
}

export const ActivationCodes = () => {
  const [codes, setCodes] = useState<ActivationCode[]>([
    {
      id: "1",
      code: "789123",
      phoneNumber: "0796286263",
      packageName: "Basic Starter",
      price: 20,
      generatedAt: "2024-01-15 14:30",
      isUsed: true,
      usedAt: "2024-01-15 14:32"
    },
    {
      id: "2",
      code: "456789",
      phoneNumber: "0712345678",
      packageName: "Premium",
      price: 50,
      generatedAt: "2024-01-15 15:45",
      isUsed: false
    },
    {
      id: "3",
      code: "123456",
      phoneNumber: "0798765432",
      packageName: "Standard",
      price: 35,
      generatedAt: "2024-01-15 16:20",
      isUsed: true,
      usedAt: "2024-01-15 16:22"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [emailsSent, setEmailsSent] = useState<string[]>([]);
  const { toast } = useToast();

  const sendEmailNotification = async (code: ActivationCode) => {
    // Simulate sending email to murithimarkray@gmail.com
    const emailContent = `
New WiFi Package Purchase - Kingsley Techlab

Customer Details:
- Phone Number: ${code.phoneNumber}
- Package: ${code.packageName}
- Price: KShs ${code.price}
- Activation Code: ${code.code}
- Purchase Time: ${code.generatedAt}

The customer has been sent their activation code.
    `;

    try {
      // In a real application, this would be an actual email service
      console.log("Email sent to murithimarkray@gmail.com:", emailContent);
      
      setEmailsSent(prev => [...prev, code.id]);
      
      toast({
        title: "Email Sent Successfully",
        description: `Notification sent to murithimarkray@gmail.com for code ${code.code}`,
      });
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send email notification",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `Code ${text} copied successfully`,
    });
  };

  const filteredCodes = codes.filter(code =>
    code.code.includes(searchTerm) ||
    code.phoneNumber.includes(searchTerm) ||
    code.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-generate new codes when packages are purchased (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a new purchase occasionally
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newCode: ActivationCode = {
          id: Date.now().toString(),
          code: Math.floor(100000 + Math.random() * 900000).toString(),
          phoneNumber: `079${Math.floor(1000000 + Math.random() * 9000000)}`,
          packageName: ["Basic Starter", "Standard", "Premium"][Math.floor(Math.random() * 3)],
          price: [20, 35, 50][Math.floor(Math.random() * 3)],
          generatedAt: new Date().toLocaleString(),
          isUsed: false
        };
        
        setCodes(prev => [newCode, ...prev]);
        
        toast({
          title: "New Purchase Detected",
          description: `Code ${newCode.code} generated for ${newCode.phoneNumber}`,
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Key className="mr-2 h-5 w-5 text-primary" />
            Activation Codes Management
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Monitor generated activation codes and email notifications to murithimarkray@gmail.com
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by code, phone number, or package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Activation Code</TableHead>
                  <TableHead className="text-muted-foreground">Phone Number</TableHead>
                  <TableHead className="text-muted-foreground">Package</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Generated</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes.map((code) => (
                  <TableRow key={code.id} className="border-border">
                    <TableCell className="font-mono font-bold text-foreground text-lg">
                      <div className="flex items-center">
                        <Key className="mr-2 h-4 w-4 text-primary" />
                        {code.code}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {code.phoneNumber}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {code.packageName}
                    </TableCell>
                    <TableCell className="text-foreground font-semibold">
                      KShs {code.price}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={code.isUsed ? "default" : "secondary"}
                        className={code.isUsed ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}
                      >
                        {code.isUsed ? (
                          <div className="flex items-center">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Used
                          </div>
                        ) : (
                          "Pending"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {code.generatedAt}
                      {code.usedAt && (
                        <div className="text-xs text-green-500">
                          Used: {code.usedAt}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(code.code)}
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copy
                        </Button>
                        {!emailsSent.includes(code.id) ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => sendEmailNotification(code)}
                            className="bg-gradient-gold hover:bg-gradient-accent text-kingsley-deep-navy"
                          >
                            <Mail className="mr-1 h-3 w-3" />
                            Send Email
                          </Button>
                        ) : (
                          <Badge variant="default" className="bg-green-500 text-white">
                            <Mail className="mr-1 h-3 w-3" />
                            Sent
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
            <h4 className="font-semibold text-foreground mb-2 flex items-center">
              <Mail className="mr-2 h-4 w-4 text-primary" />
              Email Notifications
            </h4>
            <p className="text-sm text-muted-foreground">
              All activation codes are automatically sent to: <span className="font-medium text-primary">murithimarkray@gmail.com</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Email includes customer phone number, package details, price, and activation code.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};