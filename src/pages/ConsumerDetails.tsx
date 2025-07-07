import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Package, FileText, Phone, Mail, MessageSquare, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface Consumer {
  id: number;
  name: string;
  email: string;
  products: string[];
  subscriptionStatus: string;
  consumerStatus: string;
  joinDate: string;
  lastActivity: string;
  totalSpent: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

interface QuestionnaireAnswer {
  question: string;
  answer: string;
  type: 'eligibility' | 'intake';
}

export function ConsumerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consumer, setConsumer] = useState<Consumer | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Mock data - in real app this would come from API
    const mockConsumer: Consumer = {
      id: parseInt(id || '1'),
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      products: ['Weight Management', 'Wellness'],
      subscriptionStatus: 'active',
      consumerStatus: 'active',
      joinDate: '2024-01-15',
      lastActivity: '2 days ago',
      totalSpent: '$450',
      phone: '(555) 123-4567',
      dateOfBirth: '1985-03-22',
      address: '123 Main St, Anytown, CA 90210'
    };
    setConsumer(mockConsumer);
    setIsActive(mockConsumer.consumerStatus === 'active');
  }, [id]);

  const consultationHistory = [
    { date: '2024-01-15', type: 'Initial Consultation', product: 'Weight Management', status: 'Completed' },
    { date: '2024-02-01', type: 'Follow-up', product: 'Weight Management', status: 'Completed' },
    { date: '2024-02-15', type: 'Progress Check', product: 'Weight Management', status: 'Completed' }
  ];

  const questionnaireAnswers: QuestionnaireAnswer[] = [
    { question: 'Are you currently taking any medications?', answer: 'Yes - Metformin for diabetes', type: 'eligibility' },
    { question: 'Do you have any known allergies?', answer: 'No known allergies', type: 'eligibility' },
    { question: 'What is your current weight goal?', answer: 'Lose 30 pounds', type: 'eligibility' },
    { question: 'What is your current weight?', answer: '185 lbs', type: 'intake' },
    { question: 'What is your current height?', answer: '5\'6"', type: 'intake' },
    { question: 'Do you exercise regularly?', answer: '3-4 times per week', type: 'intake' },
    { question: 'Describe your current diet', answer: 'I try to eat healthy but struggle with portion control and late-night snacking', type: 'intake' }
  ];

  const eligibilityAnswers = questionnaireAnswers.filter(q => q.type === 'eligibility');
  const intakeAnswers = questionnaireAnswers.filter(q => q.type === 'intake');

  const handleStatusToggle = (checked: boolean) => {
    setIsActive(checked);
    if (consumer) {
      setConsumer({
        ...consumer,
        consumerStatus: checked ? 'active' : 'inactive'
      });
    }
  };

  if (!consumer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{consumer.name}</h1>
              <p className="text-gray-600">{consumer.email}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={handleStatusToggle}
            />
            <label className="text-sm font-medium text-gray-700">
              Consumer Active
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consumer Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Consumer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Consumer Status</label>
                <Badge className={consumer.consumerStatus === 'active' ? 'bg-green-100 text-green-800 mt-1' : 'bg-gray-100 text-gray-800 mt-1'}>
                  {consumer.consumerStatus}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Subscription Status</label>
                <Badge className={consumer.subscriptionStatus === 'active' ? 'bg-blue-100 text-blue-800 mt-1' : 'bg-gray-100 text-gray-800 mt-1'}>
                  {consumer.subscriptionStatus}
                </Badge>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">Join Date</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {consumer.joinDate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Activity</label>
                <p className="text-sm text-gray-900 mt-1">{consumer.lastActivity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Spent</label>
                <p className="text-sm font-semibold text-green-600 mt-1">{consumer.totalSpent}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">Contact</label>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {consumer.email}
                  </p>
                  {consumer.phone && (
                    <p className="text-sm text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {consumer.phone}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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
                {consumer.products.map((product, index) => (
                  <Badge key={index} variant="secondary">
                    {product}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Activity & Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Eligibility Questionnaire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Eligibility Questionnaire Answers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eligibilityAnswers.map((qa, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <p className="font-medium text-gray-900 mb-2">{qa.question}</p>
                    <p className="text-gray-700">{qa.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Intake Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Intake Form Answers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {intakeAnswers.map((qa, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-blue-50">
                    <p className="font-medium text-gray-900 mb-2">{qa.question}</p>
                    <p className="text-gray-700">{qa.answer}</p>
                  </div>
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
        </div>
      </div>
    </div>
  );
}