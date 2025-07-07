
import { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Subscriber {
  id: number;
  name: string;
  email: string;
  products: string[];
  subscriptionStatus: string;
  accountStatus: string;
  joinDate: string;
  lastActivity: string;
  totalSpent: string;
}

export function SubscriberManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const subscribers: Subscriber[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      products: ['Weight Management', 'Wellness'],
      subscriptionStatus: 'active',
      accountStatus: 'active',
      joinDate: '2024-01-15',
      lastActivity: '2 days ago',
      totalSpent: '$450'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      products: ['Hormone Therapy'],
      subscriptionStatus: 'active',
      accountStatus: 'active',
      joinDate: '2024-02-03',
      lastActivity: '1 week ago',
      totalSpent: '$320'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      products: ['Skincare Treatment'],
      subscriptionStatus: 'cancelled',
      accountStatus: 'inactive',
      joinDate: '2024-01-28',
      lastActivity: '2 weeks ago',
      totalSpent: '$180'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      products: ['Recovery', 'Weight Management'],
      subscriptionStatus: 'active',
      accountStatus: 'active',
      joinDate: '2024-01-10',
      lastActivity: '3 days ago',
      totalSpent: '$680'
    },
    {
      id: 5,
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@email.com',
      products: ['Hormone Therapy', 'Wellness'],
      subscriptionStatus: 'paused',
      accountStatus: 'active',
      joinDate: '2024-02-10',
      lastActivity: '5 days ago',
      totalSpent: '$540'
    }
  ];

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subscriber.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || subscriber.accountStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAccountStatusToggle = (subscriberId: number, newStatus: string) => {
    // This would typically update via API call
    console.log(`Updating subscriber ${subscriberId} account status to ${newStatus}`);
  };

  const handleViewPatient = (patient: Subscriber) => {
    navigate(`/consumer/${patient.id}`);
  };

  const handleExportCSV = () => {
    // Simulate CSV export
    const csvData = filteredSubscribers.map(sub => 
      `${sub.name},${sub.email},${sub.products.join(';')},${sub.accountStatus},${sub.joinDate},${sub.totalSpent}`
    ).join('\n');
    
    const blob = new Blob([`Name,Email,Products,Account Status,Join Date,Total Spent\n${csvData}`], 
      { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'consumers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consumer Management</h1>
          <p className="text-gray-600">Manage your consumers and subscribers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-sm text-gray-600">Total Subscribers</div>
            <div className="text-xs text-green-600 font-medium">+12% this month</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">1,089</div>
            <div className="text-sm text-gray-600">Active</div>
            <div className="text-xs text-green-600 font-medium">87.3%</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">95</div>
            <div className="text-sm text-gray-600">Paused</div>
            <div className="text-xs text-yellow-600 font-medium">7.6%</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">63</div>
            <div className="text-sm text-gray-600">Inactive</div>
            <div className="text-xs text-gray-600 font-medium">5.1%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search consumers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active Account</option>
                <option value="inactive">Inactive Account</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Consumers ({filteredSubscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Subscription Status</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.name}</TableCell>
                    <TableCell className="text-gray-600">{subscriber.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {subscriber.products.map((product, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSubscriptionStatusColor(subscriber.subscriptionStatus)}>
                        {subscriber.subscriptionStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={subscriber.accountStatus === 'active'}
                          onCheckedChange={(checked) => 
                            handleAccountStatusToggle(subscriber.id, checked ? 'active' : 'inactive')
                          }
                        />
                        <Badge className={getAccountStatusColor(subscriber.accountStatus)}>
                          {subscriber.accountStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">{subscriber.joinDate}</TableCell>
                    <TableCell className="text-gray-500">{subscriber.lastActivity}</TableCell>
                    <TableCell className="font-medium">{subscriber.totalSpent}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewPatient(subscriber)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
