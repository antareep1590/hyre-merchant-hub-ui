
import { useState } from 'react';
import { MapPin, Phone, Building, RotateCcw, Plus, Edit, Power } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Pharmacy {
  id: number;
  name: string;
  npi: string;
  stateLicense: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'inactive';
  statesAvailable: string[];
  assignedProducts: string[];
  isAdminPharmacy: boolean;
}

interface MerchantPharmacySelection {
  state: string;
  selectedPharmacyId: number | null;
  isOverridden: boolean;
}

interface NewPharmacyForm {
  name: string;
  npi: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  statesAvailable: string[];
  assignedProducts: string[];
}

export function PharmacyRouting() {
  const { toast } = useToast();
  
  const [adminPharmacies] = useState<Pharmacy[]>([
    {
      id: 1,
      name: 'Central Compounding Pharmacy',
      npi: '1234567890',
      stateLicense: 'CA-12345',
      contact: {
        phone: '(555) 123-4567',
        email: 'orders@centralcompounding.com',
        address: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210'
      },
      status: 'active',
      statesAvailable: ['CA', 'NV', 'AZ'],
      assignedProducts: [],
      isAdminPharmacy: true
    },
    {
      id: 2,
      name: 'Elite Wellness Pharmacy',
      npi: '0987654321',
      stateLicense: 'TX-67890',
      contact: {
        phone: '(555) 987-6543',
        email: 'prescriptions@elitewellness.com',
        address: '456 Oak Ave',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201'
      },
      status: 'active',
      statesAvailable: ['TX', 'OK', 'LA'],
      assignedProducts: [],
      isAdminPharmacy: true
    },
    {
      id: 3,
      name: 'Northeast Specialty Pharmacy',
      npi: '1122334455',
      stateLicense: 'NY-11111',
      contact: {
        phone: '(555) 555-1234',
        email: 'info@northeastspecialty.com',
        address: '789 Broadway',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      status: 'active',
      statesAvailable: ['NY', 'NJ', 'CT', 'MA'],
      assignedProducts: [],
      isAdminPharmacy: true
    }
  ]);

  const [merchantPharmacies, setMerchantPharmacies] = useState<Pharmacy[]>([
    {
      id: 1001,
      name: 'ReviveRX',
      npi: '5566778899',
      stateLicense: 'CA-99999',
      contact: {
        phone: '(555) 234-5678',
        email: 'orders@reviverx.com',
        address: '456 Health Blvd',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105'
      },
      status: 'active',
      statesAvailable: ['CA', 'TX'],
      assignedProducts: ['Semaglutide', 'L-Carnitine'],
      isAdminPharmacy: false
    }
  ]);

  const [availableProducts] = useState<string[]>([
    'Semaglutide', 'L-Carnitine', 'B12 Injections', 'Tirzepatide', 'NAD+', 'Glutathione'
  ]);

  const [isAddPharmacyOpen, setIsAddPharmacyOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [newPharmacyForm, setNewPharmacyForm] = useState<NewPharmacyForm>({
    name: '',
    npi: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    statesAvailable: [],
    assignedProducts: []
  });

  const allPharmacies = [...adminPharmacies, ...merchantPharmacies];
  const allUSStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  const [merchantSelections, setMerchantSelections] = useState<MerchantPharmacySelection[]>([
    { state: 'CA', selectedPharmacyId: 1, isOverridden: false },
    { state: 'TX', selectedPharmacyId: 2, isOverridden: true },
    { state: 'NY', selectedPharmacyId: null, isOverridden: false }
  ]);

  // Get all unique states from all pharmacies
  const allStates = Array.from(new Set(allPharmacies.flatMap(p => p.statesAvailable))).sort();

  const resetForm = () => {
    setNewPharmacyForm({
      name: '',
      npi: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      statesAvailable: [],
      assignedProducts: []
    });
  };

  const handleSavePharmacy = () => {
    if (!newPharmacyForm.name || !newPharmacyForm.npi || !newPharmacyForm.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newPharmacy: Pharmacy = {
      id: Date.now(),
      name: newPharmacyForm.name,
      npi: newPharmacyForm.npi,
      stateLicense: `${newPharmacyForm.state}-${Math.random().toString(36).substr(2, 9)}`,
      contact: {
        phone: newPharmacyForm.phone,
        email: newPharmacyForm.email,
        address: newPharmacyForm.address,
        city: newPharmacyForm.city,
        state: newPharmacyForm.state,
        zipCode: newPharmacyForm.zipCode
      },
      status: 'active',
      statesAvailable: newPharmacyForm.statesAvailable,
      assignedProducts: newPharmacyForm.assignedProducts,
      isAdminPharmacy: false
    };

    if (editingPharmacy) {
      setMerchantPharmacies(prev => 
        prev.map(p => p.id === editingPharmacy.id ? { ...newPharmacy, id: editingPharmacy.id } : p)
      );
      toast({
        title: "Pharmacy Updated",
        description: "Pharmacy information has been updated successfully."
      });
    } else {
      setMerchantPharmacies(prev => [...prev, newPharmacy]);
      toast({
        title: "Pharmacy Added",
        description: "New pharmacy has been added successfully."
      });
    }

    setIsAddPharmacyOpen(false);
    setEditingPharmacy(null);
    resetForm();
  };

  const handleEditPharmacy = (pharmacy: Pharmacy) => {
    setEditingPharmacy(pharmacy);
    setNewPharmacyForm({
      name: pharmacy.name,
      npi: pharmacy.npi,
      phone: pharmacy.contact.phone,
      email: pharmacy.contact.email,
      address: pharmacy.contact.address,
      city: pharmacy.contact.city,
      state: pharmacy.contact.state,
      zipCode: pharmacy.contact.zipCode,
      statesAvailable: pharmacy.statesAvailable,
      assignedProducts: pharmacy.assignedProducts
    });
    setIsAddPharmacyOpen(true);
  };

  const handleTogglePharmacyStatus = (pharmacyId: number) => {
    setMerchantPharmacies(prev =>
      prev.map(p =>
        p.id === pharmacyId
          ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
          : p
      )
    );
  };

  const getPharmaciesForState = (state: string) => {
    return adminPharmacies.filter(pharmacy => 
      pharmacy.statesAvailable.includes(state) && pharmacy.status === 'active'
    );
  };

  const getMerchantSelectionForState = (state: string) => {
    return merchantSelections.find(selection => selection.state === state) || 
           { state, selectedPharmacyId: null, isOverridden: false };
  };

  const handlePharmacySelection = (state: string, pharmacyId: number | null) => {
    setMerchantSelections(prev => {
      const existing = prev.find(s => s.state === state);
      if (existing) {
        return prev.map(s => 
          s.state === state 
            ? { ...s, selectedPharmacyId: pharmacyId, isOverridden: true }
            : s
        );
      } else {
        return [...prev, { state, selectedPharmacyId: pharmacyId, isOverridden: true }];
      }
    });
  };

  const handleResetToDefault = (state: string) => {
    setMerchantSelections(prev => 
      prev.map(s => 
        s.state === state 
          ? { ...s, selectedPharmacyId: null, isOverridden: false }
          : s
      )
    );
  };

  const getSelectedPharmacy = (state: string) => {
    const selection = getMerchantSelectionForState(state);
    if (selection.selectedPharmacyId) {
      return adminPharmacies.find(p => p.id === selection.selectedPharmacyId);
    }
    return null;
  };

  const getDefaultPharmacy = (state: string) => {
    const pharmaciesInState = getPharmaciesForState(state);
    // Return the first pharmacy as default (admin's default logic)
    return pharmaciesInState[0] || null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy Management</h1>
          <p className="text-gray-600">Manage pharmacy routing and add custom pharmacies</p>
        </div>
        <Dialog open={isAddPharmacyOpen} onOpenChange={setIsAddPharmacyOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPharmacy(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Pharmacy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPharmacy ? 'Edit Pharmacy' : 'Add New Pharmacy'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Pharmacy Name *</Label>
                  <Input
                    id="name"
                    value={newPharmacyForm.name}
                    onChange={(e) => setNewPharmacyForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter pharmacy name"
                  />
                </div>
                <div>
                  <Label htmlFor="npi">NPI Number *</Label>
                  <Input
                    id="npi"
                    value={newPharmacyForm.npi}
                    onChange={(e) => setNewPharmacyForm(prev => ({ ...prev, npi: e.target.value }))}
                    placeholder="Enter NPI number"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newPharmacyForm.phone}
                    onChange={(e) => setNewPharmacyForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPharmacyForm.email}
                    onChange={(e) => setNewPharmacyForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="pharmacy@example.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newPharmacyForm.address}
                  onChange={(e) => setNewPharmacyForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newPharmacyForm.city}
                    onChange={(e) => setNewPharmacyForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select 
                    value={newPharmacyForm.state} 
                    onValueChange={(value) => setNewPharmacyForm(prev => ({ ...prev, state: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUSStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={newPharmacyForm.zipCode}
                    onChange={(e) => setNewPharmacyForm(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="12345"
                  />
                </div>
              </div>
              
              <div>
                <Label>States Available</Label>
                <div className="grid grid-cols-6 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {allUSStates.map(state => (
                    <div key={state} className="flex items-center space-x-1">
                      <Checkbox
                        id={`state-${state}`}
                        checked={newPharmacyForm.statesAvailable.includes(state)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewPharmacyForm(prev => ({
                              ...prev,
                              statesAvailable: [...prev.statesAvailable, state]
                            }));
                          } else {
                            setNewPharmacyForm(prev => ({
                              ...prev,
                              statesAvailable: prev.statesAvailable.filter(s => s !== state)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`state-${state}`} className="text-xs">{state}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Assigned Products</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableProducts.map(product => (
                    <div key={product} className="flex items-center space-x-2">
                      <Checkbox
                        id={`product-${product}`}
                        checked={newPharmacyForm.assignedProducts.includes(product)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewPharmacyForm(prev => ({
                              ...prev,
                              assignedProducts: [...prev.assignedProducts, product]
                            }));
                          } else {
                            setNewPharmacyForm(prev => ({
                              ...prev,
                              assignedProducts: prev.assignedProducts.filter(p => p !== product)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`product-${product}`} className="text-sm">{product}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddPharmacyOpen(false);
                    setEditingPharmacy(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSavePharmacy}>
                  {editingPharmacy ? 'Update' : 'Add'} Pharmacy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Message */}
      <Card className="border-0 shadow-sm bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-700">
              <strong>Routing Logic:</strong> Custom pharmacies assigned to specific states and products will override platform defaults. For unassigned combinations, the system uses the most affordable option.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* My Pharmacies */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Pharmacies</CardTitle>
            <Badge variant="outline">Merchant Pharmacies</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {merchantPharmacies.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pharmacy Name</TableHead>
                    <TableHead>Assigned States</TableHead>
                    <TableHead>Assigned Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchantPharmacies.map((pharmacy) => (
                    <TableRow key={pharmacy.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            {pharmacy.name}
                            <Badge variant="secondary" className="text-xs">Merchant</Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            NPI: {pharmacy.npi} • {pharmacy.contact.city}, {pharmacy.contact.state}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {pharmacy.statesAvailable.map(state => (
                            <Badge key={state} variant="outline" className="text-xs">
                              {state}
                              {merchantSelections.find(ms => ms.state === state && ms.selectedPharmacyId === pharmacy.id) && (
                                <span className="ml-1 text-green-600">•</span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {pharmacy.assignedProducts.slice(0, 2).map(product => (
                            <Badge key={product} className="text-xs bg-blue-100 text-blue-800">
                              {product}
                            </Badge>
                          ))}
                          {pharmacy.assignedProducts.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{pharmacy.assignedProducts.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={pharmacy.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {pharmacy.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPharmacy(pharmacy)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePharmacyStatus(pharmacy.id)}
                          >
                            <Power className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">No custom pharmacies added yet</p>
              <p className="text-sm">Add a pharmacy to override routing for specific states and products</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Pharmacies (Qualiphy) */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Platform Pharmacies</CardTitle>
            <Badge variant="outline">Qualiphy Network</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pharmacy Name</TableHead>
                  <TableHead>NPI</TableHead>
                  <TableHead>States Available</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminPharmacies.map((pharmacy) => (
                  <TableRow key={pharmacy.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          {pharmacy.name}
                          <Badge className="text-xs bg-purple-100 text-purple-800">Platform</Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {pharmacy.contact.address}, {pharmacy.contact.city}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{pharmacy.npi}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pharmacy.statesAvailable.map(state => (
                          <Badge key={state} variant="outline" className="text-xs">
                            {state}
                            {merchantSelections.find(ms => ms.state === state && !ms.isOverridden) && (
                              <span className="ml-1 text-blue-600" title="Default for state">•</span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {pharmacy.contact.phone}
                        </div>
                        <div className="text-gray-500">{pharmacy.contact.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={pharmacy.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {pharmacy.status}
                      </Badge>
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
}
