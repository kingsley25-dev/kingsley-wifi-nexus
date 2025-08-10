import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wifi, Clock, Zap, Star, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserPortalProps {
  onBack: () => void;
}

interface Package {
  id: string;
  name: string;
  price: number;
  speed: number;
  duration: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export const UserPortal = ({ onBack }: UserPortalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
  const { toast } = useToast();

  const packages: Package[] = [
    {
      id: "1",
      name: "Basic Starter",
      price: 20,
      speed: 10,
      duration: 8,
      description: "Perfect for browsing and social media",
      features: ["10 Mbps Speed", "8 Hours Duration", "Basic Support", "Instant Activation"]
    },
    {
      id: "2",
      name: "Standard",
      price: 35,
      speed: 15,
      duration: 6,
      description: "Good for streaming and downloads",
      features: ["15 Mbps Speed", "6 Hours Duration", "Priority Support", "HD Streaming"]
    },
    {
      id: "3",
      name: "Premium",
      price: 50,
      speed: 25,
      duration: 12,
      description: "High-speed for heavy usage",
      features: ["25 Mbps Speed", "12 Hours Duration", "Premium Support", "4K Streaming"],
      popular: true
    },
    {
      id: "4",
      name: "Ultra Fast",
      price: 80,
      speed: 35,
      duration: 24,
      description: "Maximum speed for power users",
      features: ["35 Mbps Speed", "24 Hours Duration", "VIP Support", "Gaming Optimized"]
    },
    {
      id: "5",
      name: "Business",
      price: 120,
      speed: 50,
      duration: 48,
      description: "Professional package for businesses",
      features: ["50 Mbps Speed", "48 Hours Duration", "Business Support", "Multiple Devices"]
    },
    {
      id: "6",
      name: "Student Special",
      price: 15,
      speed: 8,
      duration: 4,
      description: "Affordable option for students",
      features: ["8 Mbps Speed", "4 Hours Duration", "Student Support", "Study Mode"]
    },
    {
      id: "7",
      name: "Night Owl",
      price: 30,
      speed: 20,
      duration: 10,
      description: "Perfect for late night browsing",
      features: ["20 Mbps Speed", "10 Hours Duration", "Night Support", "Off-Peak Pricing"]
    }
  ];

  const generateActivationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handlePurchase = async () => {
    if (!selectedPackage || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please select a package and enter your phone number",
        variant: "destructive"
      });
      return;
    }

    if (!/^07\d{8}$/.test(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (format: 0796286263)",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const code = generateActivationCode();
      setActivationCode(code);
      setIsPurchaseComplete(true);
      setIsProcessing(false);

      // Simulate sending email notification
      console.log(`Email sent to murithimarkray@gmail.com:
        New Purchase:
        Phone: ${phoneNumber}
        Package: ${selectedPackage.name}
        Price: KShs ${selectedPackage.price}
        Code: ${code}
      `);

      toast({
        title: "Purchase Successful!",
        description: `Your activation code is ${code}. Check your SMS for details.`,
      });
    }, 3000);
  };

  if (isPurchaseComplete && activationCode) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border shadow-navy">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-gold rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-kingsley-deep-navy" />
              </div>
            </div>
            <CardTitle className="text-2xl text-foreground">Purchase Complete!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your WiFi package has been activated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg border border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Activation Code</p>
              <p className="text-3xl font-bold font-mono text-primary">{activationCode}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package:</span>
                <span className="text-foreground font-medium">{selectedPackage?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Speed:</span>
                <span className="text-foreground font-medium">{selectedPackage?.speed} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="text-foreground font-medium">{selectedPackage?.duration} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="text-foreground font-medium">KShs {selectedPackage?.price}</span>
              </div>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground text-center">
                Connect to Kingsley Techlab WiFi network and enter your activation code to start browsing.
                Timer starts when you connect.
              </p>
            </div>

            <Button 
              onClick={onBack} 
              className="w-full bg-gradient-gold hover:bg-gradient-accent text-kingsley-deep-navy font-semibold"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="container mx-auto">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-primary hover:text-accent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
            Choose Your WiFi Package
          </h1>
          <p className="text-muted-foreground text-lg">
            Select the perfect internet package for your needs
          </p>
        </div>

        {/* Package Selection */}
        {!selectedPackage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {packages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative bg-card/80 backdrop-blur-sm border-border shadow-navy cursor-pointer transition-all hover:shadow-gold hover:scale-105 ${
                  pkg.popular ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-gold text-kingsley-deep-navy font-semibold px-3 py-1">
                      <Star className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">{pkg.name}</CardTitle>
                    <div className="h-10 w-10 bg-gradient-gold rounded-full flex items-center justify-center">
                      <Wifi className="h-5 w-5 text-kingsley-deep-navy" />
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-foreground">
                      KShs {pkg.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pkg.speed} Mbps • {pkg.duration} hours
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full mt-6 bg-gradient-gold hover:bg-gradient-accent text-kingsley-deep-navy font-semibold"
                  >
                    Select Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Purchase Form */
          <div className="max-w-md mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
              <CardHeader>
                <CardTitle className="text-foreground">Complete Your Purchase</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Enter your phone number to receive activation code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Package Summary */}
                <div className="p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{selectedPackage.name}</span>
                    <Badge className="bg-primary text-primary-foreground">
                      {selectedPackage.speed} Mbps
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Duration: {selectedPackage.duration} hours</span>
                    <span className="text-xl font-bold text-foreground">KShs {selectedPackage.price}</span>
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0796286263"
                    className="bg-input border-border text-foreground"
                    maxLength={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your phone number to receive activation code via SMS
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPackage(null)}
                    className="flex-1 border-border text-foreground w-full sm:w-auto"
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePurchase}
                    disabled={isProcessing || !phoneNumber}
                    className="flex-1 bg-gradient-gold hover:bg-gradient-accent text-kingsley-deep-navy font-semibold w-full sm:w-auto"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-kingsley-deep-navy mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Zap className="mr-2 h-4 w-4" />
                        Buy Package
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customer Service Footer */}
        <div className="mt-16 text-center pb-8">
          <div className="inline-flex items-center justify-center p-6 bg-card/60 backdrop-blur-sm rounded-lg border border-border shadow-navy">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-2">Need Help? Contact Customer Service</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-8 w-8 bg-gradient-gold rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-kingsley-deep-navy" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <a 
                  href="tel:0796286263" 
                  className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                >
                  0796286263
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Available 24/7 for support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};