
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CouponForm } from './CouponForm';
import { DeleteCouponDialog } from './DeleteCouponDialog';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  appliesTo: 'all' | 'selected';
  selectedProducts: string[];
  usageLimit?: number;
  currentUsage: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    appliesTo: 'all',
    selectedProducts: [],
    usageLimit: 100,
    currentUsage: 45,
    expiryDate: '2024-12-31',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    code: 'SUMMER50',
    discountType: 'flat',
    discountValue: 50,
    appliesTo: 'selected',
    selectedProducts: ['Semaglutide', 'Tirzepatide'],
    usageLimit: 50,
    currentUsage: 12,
    expiryDate: '2024-08-31',
    isActive: false,
    createdAt: '2024-06-01'
  }
];

export const CouponManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleCreateCoupon = (newCoupon: Omit<Coupon, 'id' | 'currentUsage' | 'createdAt'>) => {
    const coupon: Coupon = {
      ...newCoupon,
      id: Date.now().toString(),
      currentUsage: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCoupons([...coupons, coupon]);
    setShowForm(false);
  };

  const handleEditCoupon = (updatedCoupon: Coupon) => {
    setCoupons(coupons.map(c => c.id === updatedCoupon.id ? updatedCoupon : c));
    setEditingCoupon(null);
  };

  const handleToggleStatus = (id: string) => {
    setCoupons(coupons.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleDeleteCoupon = (id: string) => {
    setCouponToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (couponToDelete) {
      setCoupons(coupons.filter(c => c.id !== couponToDelete));
      setCouponToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const getStatusBadge = (coupon: Coupon) => {
    const isExpired = new Date(coupon.expiryDate) < new Date();
    const isLimitReached = coupon.usageLimit && coupon.currentUsage >= coupon.usageLimit;
    
    if (isExpired) return <Badge variant="destructive">Expired</Badge>;
    if (isLimitReached) return <Badge variant="secondary">Limit Reached</Badge>;
    if (!coupon.isActive) return <Badge variant="outline">Inactive</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  const filteredCoupons = coupons.filter(coupon => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return coupon.isActive && new Date(coupon.expiryDate) >= new Date();
    if (statusFilter === 'inactive') return !coupon.isActive;
    if (statusFilter === 'expired') return new Date(coupon.expiryDate) < new Date();
    return true;
  });

  if (showForm || editingCoupon) {
    return (
      <CouponForm
        coupon={editingCoupon}
        onSave={editingCoupon ? handleEditCoupon : handleCreateCoupon}
        onCancel={() => {
          setShowForm(false);
          setEditingCoupon(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-2">Create and manage discount codes for your products</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Coupon List</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}%` 
                      : `$${coupon.discountValue}`
                    }
                  </TableCell>
                  <TableCell>
                    {coupon.appliesTo === 'all' 
                      ? 'All Products' 
                      : `${coupon.selectedProducts.length} Products`
                    }
                  </TableCell>
                  <TableCell>
                    {coupon.usageLimit 
                      ? `${coupon.currentUsage}/${coupon.usageLimit}`
                      : `${coupon.currentUsage}`
                    }
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon)}</TableCell>
                  <TableCell>{new Date(coupon.expiryDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Switch
                      checked={coupon.isActive}
                      onCheckedChange={() => handleToggleStatus(coupon.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCoupon(coupon)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCoupon(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteCouponDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        couponCode={coupons.find(c => c.id === couponToDelete)?.code || ''}
      />
    </div>
  );
};
