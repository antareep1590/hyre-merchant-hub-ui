
import { useState } from 'react';
import { DollarSign, TrendingUp, Clock, Download, RefreshCw, Eye } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PayoutsTransactions() {
  const [transactions] = useState([
    {
      id: 'TXN-001',
      date: '2024-06-25',
      patient: 'Sarah Johnson',
      product: 'Semaglutide Weight Management',
      type: 'subscription',
      amount: 285.00,
      platformFee: 42.75,
      merchantEarnings: 242.25,
      status: 'completed'
    },
    {
      id: 'TXN-002',
      date: '2024-06-24',
      patient: 'Mike Chen',
      product: 'Testosterone Replacement Therapy',
      type: 'consultation',
      amount: 150.00,
      platformFee: 22.50,
      merchantEarnings: 127.50,
      status: 'completed'
    },
    {
      id: 'TXN-003',
      date: '2024-06-24',
      patient: 'Emma Davis',
      product: 'Skincare Treatment Package',
      type: 'subscription',
      amount: 320.00,
      platformFee: 48.00,
      merchantEarnings: 272.00,
      status: 'pending'
    },
    {
      id: 'TXN-004',
      date: '2024-06-23',
      patient: 'James Wilson',
      product: 'Peptide Therapy - BPC-157',
      type: 'one-time',
      amount: 180.00,
      platformFee: 27.00,
      merchantEarnings: 153.00,
      status: 'completed'
    }
  ]);

  const [payouts] = useState([
    {
      id: 'PO-001',
      date: '2024-06-20',
      amount: 2450.75,
      transactions: 18,
      status: 'completed',
      method: 'Bank Transfer',
      processingTime: '2-3 business days'
    },
    {
      id: 'PO-002',
      date: '2024-06-13',
      amount: 1890.25,
      transactions: 14,
      status: 'completed',
      method: 'Bank Transfer',
      processingTime: '2-3 business days'
    },
    {
      id: 'PO-003',
      date: '2024-06-06',
      amount: 3120.50,
      transactions: 22,
      status: 'completed',
      method: 'Bank Transfer',
      processingTime: '2-3 business days'
    }
  ]);

  const totalEarnings = transactions.reduce((sum, t) => sum + t.merchantEarnings, 0);
  const pendingEarnings = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.merchantEarnings, 0);
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payouts & Transactions</h1>
          <p className="text-gray-600">Track your earnings and manage payouts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Available Balance</p>
                <p className="text-2xl font-bold text-green-900">${pendingEarnings.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-green-600 font-medium">+15% this month</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{completedTransactions}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Payout</p>
                <p className="text-2xl font-bold text-gray-900">June 27</p>
                <p className="text-xs text-gray-500">2 days</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Transactions ({transactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Your Earnings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-medium">{transaction.patient}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {transaction.product}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{transaction.type}</TableCell>
                        <TableCell className="font-medium">${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-red-600">-${transaction.platformFee.toFixed(2)}</TableCell>
                        <TableCell className="font-bold text-green-600">
                          ${transaction.merchantEarnings.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              Refund
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
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Payout History ({payouts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Processing Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                        <TableCell>{payout.date}</TableCell>
                        <TableCell className="font-bold">${payout.amount.toFixed(2)}</TableCell>
                        <TableCell>{payout.transactions} transactions</TableCell>
                        <TableCell>{payout.method}</TableCell>
                        <TableCell className="text-sm text-gray-600">{payout.processingTime}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payout.status)}>
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">
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

          {/* Payout Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payout Method
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Bank Transfer (ACH)</option>
                      <option>Wire Transfer</option>
                      <option>PayPal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payout Schedule
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Weekly (Mondays)</option>
                      <option>Bi-weekly</option>
                      <option>Monthly</option>
                      <option>Manual</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Payout Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="100.00"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="autoPayouts" className="rounded" />
                    <label htmlFor="autoPayouts" className="text-sm text-gray-700">
                      Enable automatic payouts
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button>Update Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
