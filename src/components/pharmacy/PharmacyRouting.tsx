
import { useState } from 'react';
import { MapPin, Phone, Building, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  isAdminPharmacy: boolean;
}

interface MerchantPharmacySelection {
  state: string;
  selectedPharmacyId: number | null;
  isOverridden: boolean;
}

export function PharmacyRouting() {
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
      isAdminPharmacy: true
    }
  ]);

  const [merchantSelections, setMerchantSelections] = useState<MerchantPharmacySelection[]>([
    { state: 'CA', selectedPharmacyId: 1, isOverridden: false },
    { state: 'TX', selectedPharmacyId: 2, isOverridden: true },
    { state: 'NY', selectedPharmacyId: null, isOverridden: false }
  ]);

  // Get all unique states from all pharmacies
  const allStates = Array.from(new Set(adminPharmacies.flatMap(p => p.statesAvailable))).sort();

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
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy Settings</h1>
          <p className="text-gray-600">Select preferred pharmacies for each state</p>
        </div>
      </div>

      {/* Info Message */}
      <Card className="border-0 shadow-sm bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> You can select one preferred pharmacy per state from our partner network. If no pharmacy is selected, the system will use the default most affordable option.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* State-wise Pharmacy Selection */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Pharmacy Selection by State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {allStates.map(state => {
              const pharmaciesInState = getPharmaciesForState(state);
              const merchantSelection = getMerchantSelectionForState(state);
              const selectedPharmacy = getSelectedPharmacy(state);
              const defaultPharmacy = getDefaultPharmacy(state);
              
              return (
                <div key={state} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-sm font-semibold">
                        {state}
                      </Badge>
                      <span className="text-lg font-medium">State Pharmacies</span>
                      {merchantSelection.isOverridden && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          Custom Selection
                        </Badge>
                      )}
                    </div>
                    {merchantSelection.isOverridden && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetToDefault(state)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Default
                      </Button>
                    )}
                  </div>

                  {pharmaciesInState.length > 0 ? (
                    <div className="space-y-3">
                      {/* Default Selection Option */}
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        !merchantSelection.selectedPharmacyId && !merchantSelection.isOverridden
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`pharmacy-${state}`}
                                checked={!merchantSelection.selectedPharmacyId && !merchantSelection.isOverridden}
                                onChange={() => handlePharmacySelection(state, null)}
                                className="text-blue-600"
                              />
                              <label className="font-medium text-gray-900">
                                Use Default (Most Affordable)
                              </label>
                              <Badge variant="secondary" className="text-xs">
                                System Default
                              </Badge>
                            </div>
                            {defaultPharmacy && (
                              <p className="text-sm text-gray-600 ml-6">
                                Currently: {defaultPharmacy.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Individual Pharmacy Options */}
                      {pharmaciesInState.map(pharmacy => (
                        <div
                          key={pharmacy.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            merchantSelection.selectedPharmacyId === pharmacy.id
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`pharmacy-${state}`}
                                checked={merchantSelection.selectedPharmacyId === pharmacy.id}
                                onChange={() => handlePharmacySelection(state, pharmacy.id)}
                                className="text-blue-600"
                              />
                              <div>
                                <div className="font-medium text-gray-900">{pharmacy.name}</div>
                                <div className="text-sm text-gray-600">
                                  {pharmacy.contact.city}, {pharmacy.contact.state} • NPI: {pharmacy.npi}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {pharmacy.contact.phone}
                                </div>
                              </div>
                            </div>
                            <Badge 
                              className="bg-green-100 text-green-800"
                            >
                              Active
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No pharmacies available for {state}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Pharmacies Overview */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>All Platform Pharmacies</CardTitle>
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
                        <div className="font-medium">{pharmacy.name}</div>
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
