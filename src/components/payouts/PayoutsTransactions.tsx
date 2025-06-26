
import { useState } from 'react';
import { DollarSign, TrendingUp, Clock, Download, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Transaction {
  id: string;
  date: string;
  patient: string;
  product: string;
  type: string;
  amount: number;
  platformFee: number;
  merchantEarnings: number;
  status: 'completed' | 'pending' | 'refunded';
}

interface Payout {
  id: string;
  date: string;
  amount: number;
  transactions: number;
  status: 'completed' | 'pending' | 'processing';
  method: string;
  processingTime: string;
}

export function PayoutsTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([
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

  const [payouts, setPayouts] = useState<Payout[]>([
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

  const [refundingTransaction, setRefundingTransaction] = useState<string | null>(null);
  const [refundData, setRefundData] = useState({
    reason: '',
    amount: 0,
    refundFee: true
  });
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<string | null>(null);

  const totalEarnings = transactions.reduce((sum, t) => sum + t.merchantEarnings, 0);
  const availableBalance = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.merchantEarnings, 0);
  const pendingEarnings = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.merchantEarnings, 0);
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;

  const handleRefund = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setRefundingTransaction(transactionId);
      setRefundData({
        reason: '',
        amount: transaction.amount,
        refundFee: true
      });
    }
  };

  const confirmRefund = () => {
    if (refundingTransaction) {
      setTransactions(prev => prev.map(t => 
        t.id === refundingTransaction 
          ? { ...t, status: 'refunded' as const }
          : t
      ));
      setRefundingTransaction(null);
      setRefundData({ reason: '', amount: 0, refundFee: true });
    }
  };

  const handleRequestPayout = () => {
    const newPayout: Payout = {
      id: `PO-${String(payouts.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      amount: availableBalance,
      transactions: completedTransactions,
      status: 'processing',
      method: 'Bank Transfer',
      processingTime: '2-3 business days'
    };
    
    setPayouts(prev => [newPayout, ...prev]);
    setShowPayoutModal(false);
  };

  const handleViewTransaction = (transactionId: string) => {
    setViewingTransaction(transactionId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Transaction ID', 'Date', 'Patient', 'Product', 'Amount', 'Your Earnings', 'Status'],
      ...transactions.map(t => [
        t.id, t.date, t.patient, t.product, 
        `$${t.amount.toFixed(2)}`, `$${t.merchantEarnings.toFixed(2)}`, t.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setShowPayoutModal(true)}>
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
                <p className="text-2xl font-bold text-green-900">${availableBalance.toFixed(2)}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${pendingEarnings.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Processing</p>
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
          {/* Refund Form */}
          {refundingTransaction && (
            <Card className="border-0 shadow-sm bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Process Refund - {refundingTransaction}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refund Reason *
                    </label>
                    <Input
                      placeholder="Enter refund reason..."
                      value={refundData.reason}
                      onChange={(e) => setRefundData(prev => ({ ...prev, reason: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refund Amount
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={refundData.amount}
                      onChange={(e) => setRefundData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="refundFee"
                    checked={refundData.refundFee}
                    onChange={(e) => setRefundData(prev => ({ ...prev, refundFee: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="refundFee" className="text-sm text-gray-700">
                    Also refund platform fee
                  </label>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setRefundingTransaction(null)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmRefund}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Process Refund
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transaction Details Modal */}
          {viewingTransaction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md bg-white shadow-2xl">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center justify-between">
                    Transaction Details
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setViewingTransaction(null)}
                    >
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {(() => {
                    const transaction = transactions.find(t => t.id === viewingTransaction);
                    if (!transaction) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-500">Transaction ID</p>
                            <p>{transaction.id}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Date</p>
                            <p>{transaction.date}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Patient</p>
                            <p>{transaction.patient}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Product</p>
                            <p>{transaction.product}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Amount</p>
                            <p>${transaction.amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Your Earnings</p>
                            <p className="text-green-600 font-bold">${transaction.merchantEarnings.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          )}

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
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleViewTransaction(transaction.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {transaction.status === 'completed' && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-red-600"
                                onClick={() => handleRefund(transaction.id)}
                              >
                                Refund
                              </Button>
                            )}
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <span>Request Payout</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Payout Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Available Balance:</span>
                      <span className="font-bold">${availableBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Transactions:</span>
                      <span>{completedTransactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Time:</span>
                      <span>2-3 business days</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  This payout will be processed via bank transfer to your registered account.
                </p>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPayoutModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestPayout}>
                  Confirm Payout Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
