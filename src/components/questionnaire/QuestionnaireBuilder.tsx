
import { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical, Save, X, Check } from 'lucide-react';
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
  category: 'general' | 'product-specific';
  productId?: number;
  options?: string[];
  correctAnswer?: string;
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
      category: 'general'
    },
    {
      id: 2,
      type: 'radio',
      question: 'Have you used similar treatments before?',
      options: ['Yes', 'No', 'Not sure'],
      required: true,
      category: 'general',
      correctAnswer: 'Yes'
    },
    {
      id: 3,
      type: 'number',
      question: 'What is your current weight? (lbs)',
      required: true,
      category: 'product-specific',
      productId: 1
    },
    {
      id: 4,
      type: 'radio',
      question: 'Are you currently taking any medications?',
      options: ['Yes', 'No'],
      required: true,
      category: 'product-specific',
      productId: 1,
      correctAnswer: 'No'
    }
  ]);

  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'text',
    question: '',
    required: false,
    category: 'general',
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

  const products = [
    { id: 1, name: 'Semaglutide Weight Management' },
    { id: 2, name: 'Testosterone Replacement Therapy' }
  ];

  const handleAddQuestion = (category: 'general' | 'product-specific', fieldType: string) => {
    const newQ: Question = {
      id: Math.max(...questions.map(q => q.id)) + 1,
      type: fieldType,
      question: `New ${fieldType} question`,
      required: false,
      category: category,
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'general' | 'product-specific' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="general">General Questions</option>
                <option value="product-specific">Product-Specific</option>
              </select>
            </div>
          </div>

          {formData.category === 'product-specific' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Product</label>
              <select
                value={formData.productId || ''}
                onChange={(e) => setFormData({ ...formData, productId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
                
                {formData.options && formData.options.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer (for eligibility)</label>
                    <select
                      value={formData.correctAnswer || ''}
                      onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">No correct answer required</option>
                      {formData.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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

  const generalQuestions = questions.filter(q => q.category === 'general');
  const productQuestions = questions.filter(q => q.category === 'product-specific');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questionnaire Builder</h1>
          <p className="text-gray-600">Create and manage patient intake forms</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save & Publish
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Questions ({generalQuestions.length})</TabsTrigger>
          <TabsTrigger value="product-specific">Product-Specific ({productQuestions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
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
                      onClick={() => handleAddQuestion('general', field.type)}
                    >
                      <span className="mr-2">{field.icon}</span>
                      {field.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* General Questions */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">General Questions</CardTitle>
                  <p className="text-sm text-gray-600">Questions shown to all patients</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generalQuestions.map((question) => (
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
                              {question.correctAnswer && (
                                <Badge className="text-xs bg-green-100 text-green-800">
                                  Eligibility Check
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium">{question.question}</p>
                            {question.options && (
                              <p className="text-sm text-gray-500 mt-1">
                                Options: {question.options.join(', ')}
                              </p>
                            )}
                            {question.correctAnswer && (
                              <p className="text-sm text-green-600 mt-1">
                                Correct answer: {question.correctAnswer}
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
                    
                    {generalQuestions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No general questions yet</p>
                        <p className="text-sm">Add questions from the field types panel</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="product-specific" className="space-y-6">
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
                      onClick={() => handleAddQuestion('product-specific', field.type)}
                    >
                      <span className="mr-2">{field.icon}</span>
                      {field.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product-Specific Questions */}
            <div className="lg:col-span-3 space-y-4">
              {products.map((product) => {
                const productQuestionsList = productQuestions.filter(q => q.productId === product.id);
                return (
                  <Card key={product.id} className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-gray-600">Product-specific intake questions</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {productQuestionsList.map((question) => (
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
                                  {question.correctAnswer && (
                                    <Badge className="text-xs bg-green-100 text-green-800">
                                      Eligibility Check
                                    </Badge>
                                  )}
                                </div>
                                <p className="font-medium">{question.question}</p>
                                {question.options && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Options: {question.options.join(', ')}
                                  </p>
                                )}
                                {question.correctAnswer && (
                                  <p className="text-sm text-green-600 mt-1">
                                    Correct answer: {question.correctAnswer}
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
                        
                        {productQuestionsList.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p>No questions for this product yet</p>
                            <p className="text-sm">Add questions from the field types panel</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
