
import { X, User, Calendar, Package, FileText, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Patient {
  id: number;
  name: string;
  email: string;
  products: string[];
  status: string;
  joinDate: string;
  lastActivity: string;
  totalSpent: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

interface PatientProfileProps {
  patient: Patient;
  onClose: () => void;
}

export function PatientProfile({ patient, onClose }: PatientProfileProps) {
  const consultationHistory = [
    { date: '2024-01-15', type: 'Initial Consultation', product: 'Weight Management', status: 'Completed' },
    { date: '2024-02-01', type: 'Follow-up', product: 'Weight Management', status: 'Completed' },
    { date: '2024-02-15', type: 'Progress Check', product: 'Weight Management', status: 'Completed' }
  ];

  const intakeHistory = [
    { date: '2024-01-10', form: 'Weight Management Intake', status: 'Submitted' },
    { date: '2024-01-12', form: 'Medical History Form', status: 'Submitted' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
              <p className="text-gray-600">{patient.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Consumer Details */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Consumer Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge className={patient.status === 'active' ? 'bg-green-100 text-green-800 mt-1' : 'mt-1'}>
                      {patient.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Join Date</label>
                    <p className="text-sm text-gray-900 mt-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {patient.joinDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Activity</label>
                    <p className="text-sm text-gray-900 mt-1">{patient.lastActivity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Spent</label>
                    <p className="text-sm font-semibold text-green-600 mt-1">{patient.totalSpent}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact</label>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {patient.email}
                      </p>
                      {patient.phone && (
                        <p className="text-sm text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {patient.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Activity & History */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subscribed Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Subscribed Products</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {patient.products.map((product, index) => (
                      <Badge key={index} variant="secondary">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Consultation History */}
              <Card>
                <CardHeader>
                  <CardTitle>Consultation History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {consultationHistory.map((consultation, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{consultation.type}</p>
                          <p className="text-sm text-gray-600">{consultation.product}</p>
                          <p className="text-sm text-gray-500">{consultation.date}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {consultation.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Intake Form History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Intake Form History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {intakeHistory.map((form, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{form.form}</p>
                          <p className="text-sm text-gray-500">{form.date}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {form.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
