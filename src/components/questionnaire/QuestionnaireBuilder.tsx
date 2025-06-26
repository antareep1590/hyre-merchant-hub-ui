import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, GripVertical, Settings, Save, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Question {
  id: number;
  type: string;
  question: string;
  required: boolean;
  section: string;
  options?: string[];
}

interface FieldType {
  type: string;
  label: string;
  icon: string;
}

export function QuestionnaireBuilder() {
  const [questions, setQuestions] = useState<Question[]>([
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

  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'text',
    question: '',
    required: false,
    section: 'General Health',
    options: []
  });

  const fieldTypes: FieldType[] = [
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

  const handleAddQuestion = (section: string, fieldType: string) => {
    const newQ: Question = {
      id: Math.max(...questions.map(q => q.id)) + 1,
      type: fieldType,
      question: `New ${fieldType} question`,
      required: false,
      section: section,
      options: ['radio', 'checkbox', 'dropdown'].includes(fieldType) ? ['Option 1', 'Option 2'] : undefined
    };
    setQuestions([...questions, newQ]);
    setEditingQuestion(newQ.id);
  };

  const handleEditQuestion = (questionId: number) => {
    setEditingQuestion(editingQuestion === questionId ? null : questionId);
  };

  const handleSaveQuestion = (questionId: number, updatedQuestion: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updatedQuestion } : q
    ));
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const QuestionEditor = ({ question, onSave, onCancel }: { 
    question: Question; 
    onSave: (data: Partial<Question>) => void; 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState<Partial<Question>>(question);

    const updateOption = (index: number, value: string) => {
      const newOptions = [...(formData.options || [])];
      newOptions[index] = value;
      setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
      setFormData({ 
        ...formData, 
        options: [...(formData.options || []), `Option ${(formData.options?.length || 0) + 1}`] 
      });
    };

    const removeOption = (index: number) => {
      const newOptions = formData.options?.filter((_, i) => i !== index) || [];
      setFormData({ ...formData, options: newOptions });
    };

    return (
      <div className="border-l-4 border-blue-500 bg-blue-50/30 p-4 m-2 rounded-r-lg animate-fade-in">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
            <Input
              value={formData.question || ''}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {fieldTypes.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.required || false}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
            />
            <label className="text-sm text-gray-700">Required field</label>
          </div>

          {['radio', 'checkbox', 'dropdown'].includes(formData.type || '') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="space-y-2">
                {formData.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => onSave(formData)} className="bg-blue-600 hover:bg-blue-700">
              <Check className="h-4 w-4 mr-2" />
              Save Question
            </Button>
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
          <h1 className="text-2xl font-bold text-gray-900">Questionnaire Builder</h1>
          <p className="text-gray-600">Create and manage patient intake forms</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Preview Form'}
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save & Publish
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <Card className="border-2 border-green-200 shadow-lg">
          <CardHeader className="bg-green-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800">Form Preview</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Patient Intake Form</h2>
                <p className="text-gray-600 mt-2">Please complete this form before your consultation</p>
              </div>
              
              {sections.map((section) => {
                const sectionQuestions = questions.filter(q => q.section === section);
                if (sectionQuestions.length === 0) return null;
                
                return (
                  <div key={section} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{section}</h3>
                    {sectionQuestions.map((question) => (
                      <div key={question.id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {question.question} {question.required && <span className="text-red-500">*</span>}
                        </label>
                        {question.type === 'text' && (
                          <Input placeholder="Your answer..." />
                        )}
                        {question.type === 'textarea' && (
                          <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} />
                        )}
                        {question.type === 'number' && (
                          <Input type="number" placeholder="Enter number..." />
                        )}
                        {question.type === 'radio' && question.options && (
                          <div className="space-y-2">
                            {question.options.map((option, idx) => (
                              <label key={idx} className="flex items-center">
                                <input type="radio" name={`question-${question.id}`} className="mr-2" />
                                {option}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

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
                      className="w-full justify-start hover:bg-blue-50"
                      size="sm"
                      onClick={() => handleAddQuestion('General Health', field.type)}
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddQuestion(section, 'text')}
                      >
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
                          <div key={question.id}>
                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
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
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleEditQuestion(question.id)}
                                  className={editingQuestion === question.id ? 'bg-blue-100' : ''}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-red-600"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {editingQuestion === question.id && (
                              <QuestionEditor
                                question={question}
                                onSave={(data) => handleSaveQuestion(question.id, data)}
                                onCancel={() => setEditingQuestion(null)}
                              />
                            )}
                          </div>
                        ))}
                      
                      {questions.filter(q => q.section === section).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No fields in this section yet</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => handleAddQuestion(section, 'text')}
                          >
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
