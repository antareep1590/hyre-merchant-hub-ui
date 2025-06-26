
import { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone, Building } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PharmacyRouting() {
  const [pharmacies] = useState([
    {
      id: 1,
      name: 'Central Compounding Pharmacy',
      npi: '1234567890',
      stateLicense: 'CA-12345',
      states: ['CA', 'NV', 'AZ'],
      contact: {
        phone: '(555) 123-4567',
        email: 'orders@centralcompounding.com',
        address: '123 Main St, Los Angeles, CA 90210'
      },
      status: 'active',
      productsAssigned: 8
    },
    {
      id: 2,
      name: 'Elite Wellness Pharmacy',
      npi: '0987654321',
      stateLicense: 'TX-67890',
      states: ['TX', 'OK', 'LA'],
      contact: {
        phone: '(555) 987-6543',
        email: 'prescriptions@elitewellness.com',
        address: '456 Oak Ave, Dallas, TX 75201'
      },
      status: 'active',
      productsAssigned: 12
    },
    {
      id: 3,
      name: 'Precision Compounding',
      npi: '1122334455',
      stateLicense: 'FL-11223',
      states: ['FL', 'GA', 'SC'],
      contact: {
        phone: '(555) 456-7890',
        email: 'info@precisioncompounding.com',
        address: '789 Beach Blvd, Miami, FL 33101'
      },
      status: 'inactive',
      productsAssigned: 5
    }
  ]);

  const [productRouting] = useState([
    {
      productName: 'Semaglutide Weight Management',
      defaultPharmacy: 'Central Compounding Pharmacy',
      stateOverrides: [
        { state: 'TX', pharmacy: 'Elite Wellness Pharmacy' },
        { state: 'FL', pharmacy: 'Precision Compounding' }
      ]
    },
    {
      productName: 'Testosterone Replacement Therapy',
      defaultPharmacy: 'Elite Wellness Pharmacy',
      stateOverrides: [
        { state: 'CA', pharmacy: 'Central Compounding Pharmacy' }
      ]
    },
    {
      productName: 'Peptide Therapy - BPC-157',
      defaultPharmacy: 'Central Compounding Pharmacy',
      stateOverrides: []
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy Routing Settings</h1>
          <p className="text-gray-600">Manage pharmacy partners and prescription routing</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Pharmacy
        </Button>
      </div>

      <Tabs defaultValue="pharmacies" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pharmacies">Pharmacy Partners</TabsTrigger>
          <TabsTrigger value="routing">Product Routing</TabsTrigger>
        </TabsList>

        <TabsContent value="pharmacies" className="space-y-6">
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
                      <TableHead>States Covered</TableHead>
                      <TableHead>Products</TableHead>
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
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {pharmacy.contact.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{pharmacy.npi}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {pharmacy.states.map((state) => (
                              <Badge key={state} variant="outline" className="text-xs">
                                {state}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{pharmacy.productsAssigned} products</TableCell>
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
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600">
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

          {/* Add/Edit Pharmacy Form */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Add New Pharmacy Partner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pharmacy Name
                    </label>
                    <Input placeholder="Enter pharmacy name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NPI Number
                    </label>
                    <Input placeholder="1234567890" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State License
                    </label>
                    <Input placeholder="CA-12345" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <Input placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <Input placeholder="orders@pharmacy.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      States Covered
                    </label>
                    <Input placeholder="CA, NV, AZ" />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <Input placeholder="123 Main St, City, State ZIP" />
                </div>
                
                <div className="md:col-span-2 flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Add Pharmacy</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="space-y-6">
          {/* Product Routing Rules */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Product Routing Rules</CardTitle>
              <p className="text-sm text-gray-600">Configure default and state-specific pharmacy routing</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {productRouting.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{product.productName}</h3>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Pharmacy
                        </label>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{product.defaultPharmacy}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State Overrides ({product.stateOverrides.length})
                        </label>
                        <div className="space-y-1">
                          {product.stateOverrides.map((override, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <Badge variant="outline">{override.state}</Badge>
                              <span>→</span>
                              <span className="text-gray-600">{override.pharmacy}</span>
                            </div>
                          ))}
                          {product.stateOverrides.length === 0 && (
                            <span className="text-sm text-gray-500">No state overrides</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Setup */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Quick Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                  <Plus className="h-6 w-6 mb-2" />
                  <span>Add Product Routing</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                  <MapPin className="h-6 w-6 mb-2" />
                  <span>Bulk State Assignment</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                  <Building className="h-6 w-6 mb-2" />
                  <span>Import Pharmacy List</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
