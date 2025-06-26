
import { useState } from 'react';
import { Search, Filter, Download, Eye, Mail, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export function SubscriberManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const subscribers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      products: ['Weight Management', 'Wellness'],
      status: 'active',
      joinDate: '2024-01-15',
      lastActivity: '2 days ago',
      totalSpent: '$450'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      products: ['Hormone Therapy'],
      status: 'active',
      joinDate: '2024-02-03',
      lastActivity: '1 week ago',
      totalSpent: '$320'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      products: ['Skincare Treatment'],
      status: 'inactive',
      joinDate: '2024-01-28',
      lastActivity: '2 weeks ago',
      totalSpent: '$180'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      products: ['Recovery', 'Weight Management'],
      status: 'active',
      joinDate: '2024-01-10',
      lastActivity: '3 days ago',
      totalSpent: '$680'
    },
    {
      id: 5,
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@email.com',
      products: ['Hormone Therapy', 'Wellness'],
      status: 'paused',
      joinDate: '2024-02-10',
      lastActivity: '5 days ago',
      totalSpent: '$540'
    }
  ];

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subscriber.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || subscriber.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriber Management</h1>
          <p className="text-gray-600">Manage your patients and subscribers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
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
                placeholder="Search subscribers..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="paused">Paused</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Subscribers ({filteredSubscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
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
                      <Badge className={getStatusColor(subscriber.status)}>
                        {subscriber.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">{subscriber.joinDate}</TableCell>
                    <TableCell className="text-gray-500">{subscriber.lastActivity}</TableCell>
                    <TableCell className="font-medium">{subscriber.totalSpent}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem className="flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>View Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Send Message</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Export Data</span>
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
    </div>
  );
}
