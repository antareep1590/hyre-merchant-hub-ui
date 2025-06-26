
import { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone, Building, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  state: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  };
  status: 'active' | 'inactive';
}

export function PharmacyRouting() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    {
      id: 1,
      name: 'Central Compounding Pharmacy',
      npi: '1234567890',
      stateLicense: 'CA-12345',
      state: 'CA',
      contact: {
        phone: '(555) 123-4567',
        email: 'orders@centralcompounding.com',
        address: '123 Main St',
        city: 'Los Angeles',
        zipCode: '90210'
      },
      status: 'active'
    },
    {
      id: 2,
      name: 'Elite Wellness Pharmacy',
      npi: '0987654321',
      stateLicense: 'TX-67890',
      state: 'TX',
      contact: {
        phone: '(555) 987-6543',
        email: 'prescriptions@elitewellness.com',
        address: '456 Oak Ave',
        city: 'Dallas',
        zipCode: '75201'
      },
      status: 'active'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    npi: '',
    stateLicense: '',
    state: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleAddPharmacy = () => {
    setShowAddForm(true);
    setFormData({
      name: '',
      npi: '',
      stateLicense: '',
      state: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      zipCode: ''
    });
  };

  const handleEditPharmacy = (pharmacy: Pharmacy) => {
    setEditingId(pharmacy.id);
    setFormData({
      name: pharmacy.name,
      npi: pharmacy.npi,
      stateLicense: pharmacy.stateLicense,
      state: pharmacy.state,
      phone: pharmacy.contact.phone,
      email: pharmacy.contact.email,
      address: pharmacy.contact.address,
      city: pharmacy.contact.city,
      zipCode: pharmacy.contact.zipCode
    });
  };

  const handleSavePharmacy = () => {
    if (editingId) {
      // Update existing pharmacy
      setPharmacies(prev => prev.map(pharmacy => 
        pharmacy.id === editingId 
          ? {
              ...pharmacy,
              name: formData.name,
              npi: formData.npi,
              stateLicense: formData.stateLicense,
              state: formData.state,
              contact: {
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                zipCode: formData.zipCode
              }
            }
          : pharmacy
      ));
      setEditingId(null);
    } else {
      // Add new pharmacy
      const newPharmacy: Pharmacy = {
        id: Math.max(...pharmacies.map(p => p.id)) + 1,
        name: formData.name,
        npi: formData.npi,
        stateLicense: formData.stateLicense,
        state: formData.state,
        contact: {
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        },
        status: 'active'
      };
      setPharmacies(prev => [...prev, newPharmacy]);
      setShowAddForm(false);
    }
    
    // Reset form
    setFormData({
      name: '',
      npi: '',
      stateLicense: '',
      state: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      zipCode: ''
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      npi: '',
      stateLicense: '',
      state: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      zipCode: ''
    });
  };

  const handleDeletePharmacy = (id: number) => {
    setPharmacies(prev => prev.filter(pharmacy => pharmacy.id !== id));
  };

  const PharmacyForm = () => (
    <Card className="border-0 shadow-sm bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {editingId ? 'Edit Pharmacy' : 'Add New Pharmacy'}
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pharmacy Name *
              </label>
              <Input 
                placeholder="Enter pharmacy name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NPI Number *
              </label>
              <Input 
                placeholder="1234567890" 
                value={formData.npi}
                onChange={(e) => setFormData(prev => ({ ...prev, npi: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State License *
              </label>
              <Input 
                placeholder="CA-12345" 
                value={formData.stateLicense}
                onChange={(e) => setFormData(prev => ({ ...prev, stateLicense: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <Input 
                placeholder="(555) 123-4567" 
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <Input 
                placeholder="orders@pharmacy.com" 
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <Input 
                placeholder="123 Main St" 
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <Input 
                  placeholder="Los Angeles" 
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <Input 
                  placeholder="90210" 
                  value={formData.zipCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSavePharmacy}>
            <Save className="h-4 w-4 mr-2" />
            {editingId ? 'Update Pharmacy' : 'Add Pharmacy'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy Routing Settings</h1>
          <p className="text-gray-600">Manage pharmacy partners for prescription routing</p>
        </div>
        <Button onClick={handleAddPharmacy}>
          <Plus className="h-4 w-4 mr-2" />
          Add Pharmacy
        </Button>
      </div>

      {/* Info Message */}
      <Card className="border-0 shadow-sm bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Only one pharmacy can be set as default per state. If no default pharmacy is set, the system will auto-select the most affordable one.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && <PharmacyForm />}

      {/* Pharmacy List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Pharmacy Partners ({pharmacies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pharmacy Name</TableHead>
                  <TableHead>NPI</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pharmacies.map((pharmacy) => (
                  <TableRow key={pharmacy.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pharmacy.name}</div>
                        <div className="text-sm text-gray-500">{pharmacy.contact.address}, {pharmacy.contact.city}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{pharmacy.npi}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {pharmacy.state}
                      </Badge>
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
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEditPharmacy(pharmacy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600"
                          onClick={() => handleDeletePharmacy(pharmacy.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
}
