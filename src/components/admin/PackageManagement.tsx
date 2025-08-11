import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, Edit, Trash2, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WifiPackage {
  id: string;
  name: string;
  price: number;
  speed: number; // in Mbps
  duration: number; // in hours
  description: string;
}

export const PackageManagement = () => {
  interface WifiPackage {
    id: string;
    name: string;
    price: number;
    speed: number; // in Mbps
    duration: number; // in hours
    description: string;
  }

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
  const queryClient = useQueryClient();

  const mapDbToUi = (row: any): WifiPackage => ({
    id: row.id,
    name: row.name,
    price: Number(row.price) || 0,
    speed: (row.speed_mbps ?? parseInt(String(row.speed).replace(/[^0-9]/g, ""))) || 0,
    duration: row.duration_hours ?? (row.duration_days ? row.duration_days * 24 : 0),
    description: row.description ?? "",
  });

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapDbToUi);
    },
  });

  const addMutation = useMutation({
    mutationFn: async (pkg: Omit<WifiPackage, "id">) => {
      const payload = {
        name: pkg.name,
        price: pkg.price,
        speed: `${pkg.speed} Mbps`,
        speed_mbps: pkg.speed,
        duration_hours: pkg.duration,
        duration_days: Math.max(1, Math.ceil(pkg.duration / 24)),
        description: pkg.description,
        popular: false,
      };
      const { error } = await supabase.from("packages").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: "Package Added", description: `${newPackage.name} saved to database` });
    },
    onError: (err: any) => {
      toast({ title: "Add failed", description: err?.message ?? "Unauthorized. Sign in as admin.", variant: "destructive" });
    },
  });

  const editMutation = useMutation({
    mutationFn: async (pkg: WifiPackage) => {
      const payload = {
        name: pkg.name,
        price: pkg.price,
        speed: `${pkg.speed} Mbps`,
        speed_mbps: pkg.speed,
        duration_hours: pkg.duration,
        duration_days: Math.max(1, Math.ceil(pkg.duration / 24)),
        description: pkg.description,
      };
      const { error } = await supabase.from("packages").update(payload).eq("id", pkg.id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: "Package Updated", description: `${variables.name} updated in database` });
    },
    onError: (err: any) => {
      toast({ title: "Update failed", description: err?.message ?? "Unauthorized. Sign in as admin.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("packages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: "Package Deleted", description: "Package removed from database" });
    },
    onError: (err: any) => {
      toast({ title: "Delete failed", description: err?.message ?? "Unauthorized. Sign in as admin.", variant: "destructive" });
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("packages_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "packages" }, () => {
        queryClient.invalidateQueries({ queryKey: ["packages"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleAddPackage = async () => {
    if (!newPackage.name || newPackage.price <= 0 || newPackage.speed <= 0 || newPackage.duration <= 0) {
      toast({ title: "Validation Error", description: "Please fill all fields with valid values", variant: "destructive" });
      return;
    }
    await addMutation.mutateAsync(newPackage);
    setNewPackage({ name: "", price: 0, speed: 0, duration: 0, description: "" });
    setIsDialogOpen(false);
  };

  const handleEditPackage = async () => {
    if (!editingPackage) return;
    await editMutation.mutateAsync(editingPackage);
    setEditingPackage(null);
    setIsDialogOpen(false);
  };

  const handleDeletePackage = async (id: string) => {
    await deleteMutation.mutateAsync(id);
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
                          ? setEditingPackage({...editingPackage!, price: parseInt(e.target.value) || 0})
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
                          ? setEditingPackage({...editingPackage!, speed: parseInt(e.target.value) || 0})
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
                          ? setEditingPackage({...editingPackage!, duration: parseInt(e.target.value) || 0})
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
                        ? setEditingPackage({...editingPackage!, description: e.target.value})
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
                {isLoading ? (
                  <TableRow className="border-border">
                    <TableCell colSpan={6} className="text-center text-muted-foreground">Loading packages...</TableCell>
                  </TableRow>
                ) : packages.length === 0 ? (
                  <TableRow className="border-border">
                    <TableCell colSpan={6} className="text-center text-muted-foreground">No packages found</TableCell>
                  </TableRow>
                ) : (
                  packages.map((pkg) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};