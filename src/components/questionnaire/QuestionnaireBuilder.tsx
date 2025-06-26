
import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, GripVertical, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function QuestionnaireBuilder() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'text',
      question: 'What is your primary health goal?',
      required: true,
      section: 'General Health'
    },
    {
      id: 2,
      type: 'radio',
      question: 'Have you used similar treatments before?',
      options: ['Yes', 'No', 'Not sure'],
      required: true,
      section: 'Medical History'
    },
    {
      id: 3,
      type: 'number',
      question: 'What is your current weight? (lbs)',
      required: true,
      section: 'Physical Assessment'
    },
    {
      id: 4,
      type: 'file',
      question: 'Please upload recent lab results (optional)',
      required: false,
      section: 'Documentation'
    }
  ]);

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'textarea', label: 'Long Text', icon: '📄' },
    { type: 'radio', label: 'Multiple Choice', icon: '⚪' },
    { type: 'checkbox', label: 'Checkboxes', icon: '☑️' },
    { type: 'dropdown', label: 'Dropdown', icon: '📋' },
    { type: 'number', label: 'Number', icon: '#️⃣' },
    { type: 'date', label: 'Date', icon: '📅' },
    { type: 'file', label: 'File Upload', icon: '📎' }
  ];

  const sections = [
    'General Health',
    'Medical History',
    'Physical Assessment',
    'Documentation',
    'Consent & Agreement'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questionnaire Builder</h1>
          <p className="text-gray-600">Create and manage patient intake forms</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Form
          </Button>
          <Button>
            Save & Publish
          </Button>
        </div>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="logic">Conditional Logic</TabsTrigger>
          <TabsTrigger value="settings">Form Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Field Types Palette */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Field Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fieldTypes.map((field) => (
                    <Button
                      key={field.type}
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <span className="mr-2">{field.icon}</span>
                      {field.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Form Builder */}
            <div className="lg:col-span-3 space-y-4">
              {sections.map((section) => (
                <Card key={section} className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{section}</CardTitle>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Field
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {questions
                        .filter(q => q.section === section)
                        .map((question) => (
                          <div
                            key={question.id}
                            className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="secondary" className="text-xs">
                                  {question.type}
                                </Badge>
                                {question.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium">{question.question}</p>
                              {question.options && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Options: {question.options.join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      
                      {questions.filter(q => q.section === section).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No fields in this section yet</p>
                          <Button size="sm" variant="outline" className="mt-2">
                            <Plus className="h-4 w-4 mr-1" />
                            Add First Field
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logic" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Conditional Logic Rules</CardTitle>
              <p className="text-sm text-gray-600">Show or hide questions based on previous answers</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Rule #1</h4>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>If</strong> "Have you used similar treatments before?" <strong>equals</strong> "Yes"
                    <br />
                    <strong>Then</strong> show "Please describe your previous experience"
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Rule #2</h4>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>If</strong> "Current weight" <strong>is greater than</strong> "200"
                    <br />
                    <strong>Then</strong> show "Additional weight management questions"
                  </p>
                </div>

                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form Title
                    </label>
                    <Input placeholder="Patient Intake Form" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form Description
                    </label>
                    <textarea 
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Please complete this form before your consultation..."
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submission Settings
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Send confirmation email
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Notify clinic staff
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Allow form editing after submission
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
