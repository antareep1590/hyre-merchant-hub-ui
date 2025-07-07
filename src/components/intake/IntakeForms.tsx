import { useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Eye, GripVertical, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Question {
  id: number;
  text: string;
  type: 'text' | 'number' | 'dropdown' | 'longtext' | 'date';
  required: boolean;
  options?: string[];
}

type QuestionType = 'text' | 'number' | 'dropdown' | 'longtext' | 'date';

const questionTypeLabels: Record<QuestionType, string> = {
  text: 'Text Input',
  number: 'Number',
  dropdown: 'Dropdown',
  longtext: 'Long Text',
  date: 'Date'
};

export function IntakeForms() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: 'What is your current weight?',
      type: 'number',
      required: true
    },
    {
      id: 2,
      text: 'What is your current height?',
      type: 'text',
      required: true
    },
    {
      id: 3,
      text: 'Do you exercise regularly?',
      type: 'dropdown',
      required: false,
      options: ['Never', '1-2 times per week', '3-4 times per week', '5+ times per week']
    }
  ]);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '',
    type: 'text',
    required: false,
    options: []
  });

  const handleAddQuestion = () => {
    if (newQuestion.text && newQuestion.type) {
      const question: Question = {
        id: Math.max(...questions.map(q => q.id), 0) + 1,
        text: newQuestion.text,
        type: newQuestion.type as QuestionType,
        required: newQuestion.required || false,
        options: newQuestion.type === 'dropdown' ? newQuestion.options : undefined
      };
      setQuestions([...questions, question]);
      setNewQuestion({ text: '', type: 'text', required: false, options: [] });
      setShowAddForm(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion({ ...question });
  };

  const handleUpdateQuestion = () => {
    if (editingQuestion && newQuestion.text && newQuestion.type) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? {
              ...q,
              text: newQuestion.text!,
              type: newQuestion.type as QuestionType,
              required: newQuestion.required || false,
              options: newQuestion.type === 'dropdown' ? newQuestion.options : undefined
            }
          : q
      ));
      setEditingQuestion(null);
      setNewQuestion({ text: '', type: 'text', required: false, options: [] });
    }
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const moveQuestion = (id: number, direction: 'up' | 'down') => {
    const index = questions.findIndex(q => q.id === id);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < questions.length - 1)
    ) {
      const newQuestions = [...questions];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  const handleResetToDefault = () => {
    setQuestions([
      {
        id: 1,
        text: 'What is your current weight?',
        type: 'number',
        required: true
      },
      {
        id: 2,
        text: 'What is your current height?',
        type: 'text',
        required: true
      },
      {
        id: 3,
        text: 'Do you exercise regularly?',
        type: 'dropdown',
        required: false,
        options: ['Never', '1-2 times per week', '3-4 times per week', '5+ times per week']
      }
    ]);
  };

  const QuestionForm = ({ 
    question, 
    onSave, 
    onCancel, 
    isEditing = false 
  }: { 
    question: Partial<Question>;
    onSave: () => void;
    onCancel: () => void;
    isEditing?: boolean;
  }) => {
    const [options, setOptions] = useState<string[]>(question.options || []);
    const [newOption, setNewOption] = useState('');

    const addOption = () => {
      if (newOption.trim()) {
        const updatedOptions = [...options, newOption.trim()];
        setOptions(updatedOptions);
        setNewQuestion(prev => ({ ...prev, options: updatedOptions }));
        setNewOption('');
      }
    };

    const removeOption = (index: number) => {
      const updatedOptions = options.filter((_, i) => i !== index);
      setOptions(updatedOptions);
      setNewQuestion(prev => ({ ...prev, options: updatedOptions }));
    };

    return (
      <Card className="border-2 border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-lg">
            {isEditing ? 'Edit Question' : 'Add New Question'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Question Text (2-100 characters) *
            </label>
            <Textarea
              placeholder="Enter your question..."
              value={newQuestion.text || ''}
              onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
              maxLength={100}
              className="min-h-[80px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              {(newQuestion.text || '').length}/100 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Question Type *
            </label>
            <Select
              value={newQuestion.type || 'text'}
              onValueChange={(value) => setNewQuestion(prev => ({ ...prev, type: value as QuestionType }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(questionTypeLabels).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {newQuestion.type === 'dropdown' && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Dropdown Options
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={option} readOnly className="flex-1" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add option..."
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addOption()}
                  />
                  <Button type="button" onClick={addOption} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={newQuestion.required || false}
                onCheckedChange={(checked) => setNewQuestion(prev => ({ ...prev, required: checked }))}
              />
              <label className="text-sm font-medium text-gray-700">
                Required field
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Question' : 'Add Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PreviewModal = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Form Preview - Patient View
            </h2>  
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6">
            {questions.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {questions[currentQuestion].text}
                    </h3>
                    {questions[currentQuestion].required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>

                  {questions[currentQuestion].type === 'text' && (
                    <Input placeholder="Enter your answer..." />
                  )}
                  {questions[currentQuestion].type === 'number' && (
                    <Input type="number" placeholder="Enter number..." />
                  )}
                  {questions[currentQuestion].type === 'longtext' && (
                    <Textarea placeholder="Enter your detailed response..." className="min-h-[120px]" />
                  )}
                  {questions[currentQuestion].type === 'date' && (
                    <Input type="date" />
                  )}
                  {questions[currentQuestion].type === 'dropdown' && (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {questions[currentQuestion].options?.map((option, index) => (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex justify-between pt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                    disabled={currentQuestion === questions.length - 1}
                  >
                    {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No questions added yet</p>
            )}
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
          <h1 className="text-2xl font-bold text-gray-900">Patient Intake Form</h1>
          <p className="text-gray-600">
            Collect general health information from patients for provider consultation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Form
          </Button>
          <Button variant="outline" onClick={handleResetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Add/Edit Question Form */}
      {(showAddForm || editingQuestion) && (
        <QuestionForm
          question={newQuestion}
          onSave={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
          onCancel={() => {
            setShowAddForm(false);
            setEditingQuestion(null);
            setNewQuestion({ text: '', type: 'text', required: false, options: [] });
          }}
          isEditing={!!editingQuestion}
        />
      )}

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle>Form Questions ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No questions added yet</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div 
                  key={question.id} 
                  className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary">
                          {questionTypeLabels[question.type]}
                        </Badge>
                        {question.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium text-gray-900 mb-1">
                        {question.text}
                      </p>
                      {question.options && (
                        <p className="text-sm text-gray-500">
                          Options: {question.options.join(', ')}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveQuestion(question.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveQuestion(question.id, 'down')}
                        disabled={index === questions.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {showPreview && <PreviewModal />}
    </div>
  );
}