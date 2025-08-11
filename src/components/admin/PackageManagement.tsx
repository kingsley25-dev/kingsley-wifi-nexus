import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, Edit, Trash2, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WifiPackage {
  id: string;
  name: string;
  price: number;
  speed: number; // in Mbps
  duration: number; // in hours
  description: string;
}

export const PackageManagement = () => {
  const [packages, setPackages] = useState<WifiPackage[]>([
    { id: "1", name: "Basic Starter", price: 20, speed: 10, duration: 8, description: "Perfect for browsing and social media" },
    { id: "2", name: "Standard", price: 35, speed: 15, duration: 6, description: "Good for streaming and downloads" },
    { id: "3", name: "Premium", price: 50, speed: 25, duration: 12, description: "High-speed for heavy usage" },
    { id: "4", name: "Ultra Fast", price: 80, speed: 35, duration: 24, description: "Maximum speed for power users" },
    { id: "5", name: "Business", price: 120, speed: 50, duration: 48, description: "Professional package for businesses" },
    { id: "6", name: "Student Special", price: 15, speed: 8, duration: 4, description: "Affordable option for students" },
    { id: "7", name: "Night Owl", price: 30, speed: 20, duration: 10, description: "Perfect for late night browsing" }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<WifiPackage | null>(null);
  const [newPackage, setNewPackage] = useState<Omit<WifiPackage, 'id'>>({
    name: "",
    price: 0,
    speed: 0,
    duration: 0,
    description: ""
  });
  const { toast } = useToast();

  const handleAddPackage = () => {
    if (!newPackage.name || newPackage.price <= 0 || newPackage.speed <= 0 || newPackage.duration <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields with valid values",
        variant: "destructive"
      });
      return;
    }

    const packageToAdd: WifiPackage = {
      id: Date.now().toString(),
      ...newPackage
    };

    setPackages([...packages, packageToAdd]);
    setNewPackage({ name: "", price: 0, speed: 0, duration: 0, description: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Package Added",
      description: `${newPackage.name} has been added successfully`,
    });
  };

  const handleEditPackage = () => {
    if (!editingPackage) return;

    setPackages(packages.map(pkg => 
      pkg.id === editingPackage.id ? editingPackage : pkg
    ));
    setEditingPackage(null);
    setIsDialogOpen(false);
    
    toast({
      title: "Package Updated",
      description: `${editingPackage.name} has been updated successfully`,
    });
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
    toast({
      title: "Package Deleted",
      description: "Package has been removed successfully",
    });
  };

  const openEditDialog = (pkg: WifiPackage) => {
    setEditingPackage({ ...pkg });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingPackage(null);
    setNewPackage({ name: "", price: 0, speed: 0, duration: 0, description: "" });
    setIsDialogOpen(true);
  };

  const currentPackage = editingPackage || newPackage;
  const isEditing = !!editingPackage;

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-navy">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center">
                <Package className="mr-2 h-5 w-5 text-primary" />
                Package Management
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage WiFi packages, pricing, and speed configurations
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={openAddDialog}
                  className="bg-gradient-gold hover:bg-gradient-accent text-kingsley-deep-navy font-semibold shadow-gold"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Package
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {isEditing ? "Edit Package" : "Add New Package"}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    {isEditing ? "Update package details" : "Create a new WiFi package"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-foreground">Package Name</Label>
                    <Input
                      id="name"
                      value={currentPackage.name}
                      onChange={(e) => isEditing 
                        ? setEditingPackage({...editingPackage, name: e.target.value})
                        : setNewPackage({...newPackage, name: e.target.value})
                      }
                      className="bg-input border-border text-foreground"
                      placeholder="e.g., Premium Package"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="price" className="text-foreground">Price (KShs)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={currentPackage.price}
                        onChange={(e) => isEditing 
                          ? setEditingPackage({...editingPackage, price: parseInt(e.target.value) || 0})
                          : setNewPackage({...newPackage, price: parseInt(e.target.value) || 0})
                        }
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="speed" className="text-foreground">Speed (Mbps)</Label>
                      <Input
                        id="speed"
                        type="number"
                        value={currentPackage.speed}
                        onChange={(e) => isEditing 
                          ? setEditingPackage({...editingPackage, speed: parseInt(e.target.value) || 0})
                          : setNewPackage({...newPackage, speed: parseInt(e.target.value) || 0})
                        }
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration" className="text-foreground">Duration (hrs)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={currentPackage.duration}
                        onChange={(e) => isEditing 
                          ? setEditingPackage({...editingPackage, duration: parseInt(e.target.value) || 0})
                          : setNewPackage({...newPackage, duration: parseInt(e.target.value) || 0})
                        }
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-foreground">Description</Label>
                    <Input
                      id="description"
                      value={currentPackage.description}
                      onChange={(e) => isEditing 
                        ? setEditingPackage({...editingPackage, description: e.target.value})
                        : setNewPackage({...newPackage, description: e.target.value})
                      }
                      className="bg-input border-border text-foreground"
                      placeholder="Package description"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-border text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={isEditing ? handleEditPackage : handleAddPackage}
                    className="bg-gradient-gold hover:bg-gradient-accent text-kingsley-deep-navy font-semibold"
                  >
                    {isEditing ? "Update" : "Add"} Package
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Package Name</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground">Speed</TableHead>
                  <TableHead className="text-muted-foreground">Duration</TableHead>
                  <TableHead className="text-muted-foreground">Description</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center">
                        <Wifi className="mr-2 h-4 w-4 text-primary" />
                        {pkg.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground font-semibold">
                      KShs {pkg.price}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {pkg.speed} Mbps
                    </TableCell>
                    <TableCell className="text-foreground">
                      {pkg.duration} hours
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {pkg.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(pkg)}
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePackage(pkg.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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