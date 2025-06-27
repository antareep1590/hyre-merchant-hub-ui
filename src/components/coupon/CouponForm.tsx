
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Coupon } from './CouponManagement';
import { useToast } from '@/hooks/use-toast';

interface CouponFormProps {
  coupon?: Coupon | null;
  onSave: (coupon: any) => void;
  onCancel: () => void;
}

const mockProducts = [
  'Semaglutide 0.25mg',
  'Semaglutide 0.5mg',
  'Tirzepatide 2.5mg',
  'Tirzepatide 5mg',
  'Metformin 500mg',
  'B12 Injection',
];

export const CouponForm = ({ coupon, onSave, onCancel }: CouponFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: 0,
    appliesTo: 'all' as 'all' | 'selected',
    selectedProducts: [] as string[],
    usageLimit: undefined as number | undefined,
    expiryDate: null as Date | null,
    isActive: true,
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        appliesTo: coupon.appliesTo,
        selectedProducts: coupon.selectedProducts,
        usageLimit: coupon.usageLimit,
        expiryDate: new Date(coupon.expiryDate),
        isActive: coupon.isActive,
      });
    }
  }, [coupon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Coupon code is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.discountValue <= 0) {
      toast({
        title: "Validation Error",
        description: "Discount value must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      toast({
        title: "Validation Error",
        description: "Percentage discount cannot exceed 100%",
        variant: "destructive"
      });
      return;
    }

    if (!formData.expiryDate) {
      toast({
        title: "Validation Error",
        description: "Expiry date is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.appliesTo === 'selected' && formData.selectedProducts.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one product",
        variant: "destructive"
      });
      return;
    }

    const couponData = {
      ...formData,
      code: formData.code.toUpperCase(),
      expiryDate: formData.expiryDate.toISOString().split('T')[0],
      ...(coupon && { id: coupon.id, currentUsage: coupon.currentUsage, createdAt: coupon.createdAt })
    };

    onSave(couponData);
    
    toast({
      title: "Success",
      description: `Coupon ${coupon ? 'updated' : 'created'} successfully`,
    });
  };

  const handleProductToggle = (product: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(product)
        ? prev.selectedProducts.filter(p => p !== product)
        : [...prev.selectedProducts, product]
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Coupons
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {coupon ? 'Edit Coupon' : 'Create New Coupon'}
          </h1>
          <p className="text-gray-600 mt-2">
            {coupon ? 'Update coupon details' : 'Set up a new discount code for your products'}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  code: e.target.value.toUpperCase() 
                }))}
                placeholder="WELCOME20"
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select 
                  value={formData.discountType} 
                  onValueChange={(value: 'percentage' | 'flat') => 
                    setFormData(prev => ({ ...prev, discountType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value * {formData.discountType === 'percentage' ? '(%)' : '($)'}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  max={formData.discountType === 'percentage' ? "100" : undefined}
                  value={formData.discountValue}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    discountValue: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applies To *</Label>
              <Select 
                value={formData.appliesTo} 
                onValueChange={(value: 'all' | 'selected') => 
                  setFormData(prev => ({ ...prev, appliesTo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="selected">Select Specific Products</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.appliesTo === 'selected' && (
              <div className="space-y-2">
                <Label>Select Products *</Label>
                <div className="border rounded-md p-4 space-y-3 max-h-48 overflow-y-auto">
                  {mockProducts.map((product) => (
                    <div key={product} className="flex items-center space-x-2">
                      <Checkbox
                        id={product}
                        checked={formData.selectedProducts.includes(product)}
                        onCheckedChange={() => handleProductToggle(product)}
                      />
                      <Label htmlFor={product} className="text-sm font-normal">
                        {product}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Selected: {formData.selectedProducts.length} products
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
              <Input
                id="usageLimit"
                type="number"
                min="1"
                value={formData.usageLimit || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  usageLimit: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="100"
              />
              <p className="text-sm text-gray-500">
                Leave empty for unlimited usage
              </p>
            </div>

            <div className="space-y-2">
              <Label>Expiry Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, expiryDate: date || null }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Activate Coupon</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {coupon ? 'Update Coupon' : 'Create Coupon'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
