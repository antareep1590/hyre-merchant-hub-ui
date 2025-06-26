
import { useState } from 'react';
import { Plus, Copy, Edit, Eye, Trash2, X } from 'lucide-react';
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

interface IntakeForm {
  id: number;
  name: string;
  product: string;
  questions: number;
  lastModified: string;
  status: 'active' | 'draft';
}

export function IntakeForms() {
  const [forms, setForms] = useState<IntakeForm[]>([
    {
      id: 1,
      name: 'Weight Management Intake',
      product: 'Semaglutide Weight Management',
      questions: 12,
      lastModified: '2 days ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Hormone Therapy Assessment',
      product: 'Testosterone Replacement Therapy',
      questions: 18,
      lastModified: '1 week ago',
      status: 'active'
    },
    {
      id: 3,
      name: 'Skincare Consultation Form',
      product: 'Skincare Treatment Package',
      questions: 8,
      lastModified: '3 days ago',
      status: 'draft'
    },
    {
      id: 4,
      name: 'Recovery Protocol Intake',
      product: 'Peptide Therapy - BPC-157',
      questions: 15,
      lastModified: '5 days ago',
      status: 'active'
    }
  ]);

  const [editingForm, setEditingForm] = useState<IntakeForm | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleEditForm = (form: IntakeForm) => {
    setEditingForm(form);
  };

  const handleCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleDuplicateGlobalForm = () => {
    const newForm: IntakeForm = {
      id: forms.length + 1,
      name: 'Duplicated Global Form',
      product: 'Select Product',
      questions: 24,
      lastModified: 'Just now',
      status: 'draft'
    };
    setForms([...forms, newForm]);
  };

  const FormEditor = ({ form, onClose }: { form: IntakeForm; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Edit Form: {form.name}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Form Builder Interface</h3>
              <p className="text-gray-600 mb-4">This would show the same question builder interface as the Questionnaire Builder</p>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Text Input</Badge>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium">What is your current weight?</p>
                    <p className="text-sm text-gray-500">Required field</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Multiple Choice</Badge>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium">Have you tried weight loss medications before?</p>
                    <p className="text-sm text-gray-500">Options: Yes, No, Not sure</p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Question
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Save Form</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product-Specific Intake Forms</h1>
          <p className="text-gray-600">Create unique intake forms for each product</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDuplicateGlobalForm}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Global Form
          </Button>
          <Button onClick={handleCreateForm}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Form
          </Button>
        </div>
      </div>

      {/* Global Form Template */}
      <Card className="border-0 shadow-sm bg-blue-50/50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Global Form Template</CardTitle>
              <p className="text-sm text-gray-600">Base template used across all products</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Global Template</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Standard Patient Intake Form</span>
              <span className="text-sm text-gray-500">24 questions</span>
              <span className="text-sm text-gray-500">Updated 1 day ago</span>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product-Specific Forms */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Product-Specific Forms ({forms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form Name</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{form.product}</Badge>
                    </TableCell>
                    <TableCell>{form.questions} questions</TableCell>
                    <TableCell>
                      <Badge 
                        variant={form.status === 'active' ? 'default' : 'secondary'}
                        className={form.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {form.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">{form.lastModified}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditForm(form)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleDuplicateGlobalForm}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
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

      {/* Form Editor Modal */}
      {editingForm && (
        <FormEditor 
          form={editingForm} 
          onClose={() => setEditingForm(null)} 
        />
      )}
    </div>
  );
}
