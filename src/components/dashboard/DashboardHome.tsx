
import { Plus, Edit, Eye, TrendingUp, Users, Package, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavigationItem } from '../layout/DashboardLayout';

interface DashboardHomeProps {
  onNavigate: (item: NavigationItem) => void;
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const stats = [
    {
      title: 'Total Patients',
      value: '1,247',
      change: '+12% this month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Monthly Earnings',
      value: '$24,580',
      change: '+8% from last month',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Active Products',
      value: '18',
      change: '+2 new this week',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Upcoming Consults',
      value: '34',
      change: 'Today',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const recentActivity = [
    { action: 'New patient enrollment', patient: 'Sarah Johnson', product: 'Weight Management Program', time: '2 hours ago', status: 'new' },
    { action: 'Consultation completed', patient: 'Mike Chen', product: 'Hormone Therapy', time: '4 hours ago', status: 'completed' },
    { action: 'Payment received', patient: 'Emma Davis', product: 'Skincare Treatment', time: '6 hours ago', status: 'payment' },
    { action: 'Form submission', patient: 'James Wilson', product: 'Recovery Protocol', time: '8 hours ago', status: 'form' },
    { action: 'Product updated', patient: 'System', product: 'Peptide Therapy pricing updated', time: '1 day ago', status: 'system' }
  ];

  const quickActions = [
    { title: 'Add New Product', description: 'Create a new treatment or service', icon: Plus, action: () => onNavigate('products') },
    { title: 'Edit Questionnaire', description: 'Update intake forms', icon: Edit, action: () => onNavigate('questionnaire') },
    { title: 'View Payouts', description: 'Check earnings and transactions', icon: Eye, action: () => onNavigate('payouts') }
  ];

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'new': return '🎯';
      case 'completed': return '✅';
      case 'payment': return '💰';
      case 'form': return '📋';
      case 'system': return '⚙️';
      default: return '📌';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-blue-100 text-lg mb-4">Manage your digital health platform with ease</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>All systems operational</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>3 pending approvals</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Package className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${stat.borderColor} border`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
                <div className={`p-4 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
            <p className="text-gray-600">Common tasks and shortcuts</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button 
                key={index}
                onClick={action.action}
                className="w-full justify-start p-4 h-auto hover:bg-gray-50 border border-gray-200 bg-white text-gray-900 hover:shadow-md transition-all duration-200" 
                variant="outline"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <action.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity - Removed "View All" button */}
        <Card className="border-0 shadow-lg lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
            <p className="text-gray-600">Latest updates and actions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="text-xl flex-shrink-0 mt-1">
                    {getActivityIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <p className="text-sm text-gray-600">{activity.patient}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.product}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
