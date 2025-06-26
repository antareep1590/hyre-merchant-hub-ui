
import { useState } from 'react';
import { Plus, Copy, Edit, Eye, Trash2 } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function IntakeForms() {
  const [forms] = useState([
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product-Specific Intake Forms</h1>
          <p className="text-gray-600">Create unique intake forms for each product</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Global Form
          </Button>
          <Button>
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
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Preview
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            •••
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem className="flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>Preview Form</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center space-x-2">
                            <Edit className="h-4 w-4" />
                            <span>Edit Form</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center space-x-2">
                            <Copy className="h-4 w-4" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center space-x-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Builder Preview */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Form Builder Preview</CardTitle>
          <p className="text-sm text-gray-600">Click on any form above to edit</p>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Weight Management Intake Form</h2>
                <p className="text-gray-600 mt-2">Please complete this form before your consultation</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What is your primary weight loss goal? *
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your answer..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have you tried weight loss medications before? *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="previous-meds" className="mr-2" />
                      Yes, and they worked well
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="previous-meds" className="mr-2" />
                      Yes, but they didn't work
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="previous-meds" className="mr-2" />
                      No, this is my first time
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current weight (lbs) *
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter weight"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
