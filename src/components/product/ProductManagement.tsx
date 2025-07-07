
import { useState } from 'react';
import { Search, Filter, Eye, RotateCcw, Edit, Check, X } from 'lucide-react';
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

interface Product {
  id: number;
  name: string;
  category: string;
  adminPrice: string;
  merchantPrice?: string;
  status: 'active' | 'inactive';
  dosages: number;
  lastModified: string;
  modifiedBy: 'Admin' | 'Merchant';
  isOverridden: boolean;
  description?: string;
  adminDescription?: string;
  benefits?: string[];
  adminBenefits?: string[];
  sideEffects?: string[];
  adminSideEffects?: string[];
  images?: string[];
  adminImages?: string[];
  dosageOptions?: { name: string; price: string; adminPrice: string; isDefault: boolean }[];
  relatedProducts?: string[];
}

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'overridden' | 'default'>('all');
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Semaglutide Weight Management',
      category: 'Weight Loss',
      adminPrice: '200',
      merchantPrice: '250',
      status: 'active',
      dosages: 3,
      lastModified: '2 days ago',
      modifiedBy: 'Merchant',
      isOverridden: true,
      description: 'Enhanced weight management program with personalized medical supervision',
      adminDescription: 'Comprehensive weight management program with medical supervision',
      benefits: ['Significant weight loss', 'Improved metabolism', 'Enhanced energy levels', 'Better health outcomes'],
      adminBenefits: ['Weight loss', 'Improved metabolism', 'Better health'],
      sideEffects: ['Mild nausea', 'Temporary fatigue'],
      adminSideEffects: ['Nausea', 'Fatigue', 'Headache'],
      images: ['product1.jpg'],
      adminImages: ['admin_product1.jpg'],
      dosageOptions: [
        { name: '0.25mg', price: '250', adminPrice: '200', isDefault: true },
        { name: '0.5mg', price: '350', adminPrice: '300', isDefault: false },
        { name: '1.0mg', price: '450', adminPrice: '400', isDefault: false }
      ],
      relatedProducts: ['Testosterone Therapy', 'Wellness Package']
    },
    {
      id: 2,
      name: 'Testosterone Replacement Therapy',
      category: 'Hormone Therapy',
      adminPrice: '150',
      status: 'active',
      dosages: 4,
      lastModified: '1 week ago',
      modifiedBy: 'Admin',
      isOverridden: false,
      description: 'Personalized hormone optimization for men',
      adminDescription: 'Personalized hormone optimization for men',
      benefits: ['Increased energy', 'Better mood', 'Improved muscle mass'],
      adminBenefits: ['Increased energy', 'Better mood', 'Improved muscle mass'],
      sideEffects: ['Mild mood changes'],
      adminSideEffects: ['Mild mood changes'],
      dosageOptions: [
        { name: '100mg/week', price: '150', adminPrice: '150', isDefault: true },
        { name: '150mg/week', price: '200', adminPrice: '200', isDefault: false },
        { name: '200mg/week', price: '250', adminPrice: '250', isDefault: false },
        { name: '250mg/week', price: '300', adminPrice: '300', isDefault: false }
      ],
      relatedProducts: ['Semaglutide', 'Recovery Package']
    }
  ]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.status === 'active') ||
                         (filterStatus === 'overridden' && product.isOverridden) ||
                         (filterStatus === 'default' && !product.isOverridden);
    
    return matchesSearch && matchesFilter;
  });

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct(false);
  };

  const handleEditProduct = () => {
    setEditingProduct(true);
  };

  const handleSaveProduct = (updatedProduct: Partial<Product>) => {
    if (selectedProduct) {
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...updatedProduct, lastModified: 'Just now', modifiedBy: 'Merchant', isOverridden: true }
          : p
      ));
      setSelectedProduct(prev => prev ? { ...prev, ...updatedProduct, lastModified: 'Just now', modifiedBy: 'Merchant', isOverridden: true } : null);
      setEditingProduct(false);
    }
  };

  const handleResetToDefault = () => {
    if (selectedProduct) {
      const resetProduct = {
        ...selectedProduct,
        name: selectedProduct.name,
        description: selectedProduct.adminDescription,
        benefits: selectedProduct.adminBenefits,
        sideEffects: selectedProduct.adminSideEffects,
        merchantPrice: undefined,
        images: selectedProduct.adminImages,
        dosageOptions: selectedProduct.dosageOptions?.map(option => ({
          ...option,
          price: option.adminPrice
        })),
        isOverridden: false,
        lastModified: 'Just now',
        modifiedBy: 'Admin' as const
      };
      
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id ? resetProduct : p
      ));
      setSelectedProduct(resetProduct);
      setEditingProduct(false);
    }
  };

  const handleStatusToggle = (productId: number, newStatus: 'active' | 'inactive') => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, status: newStatus, lastModified: 'Just now', modifiedBy: 'Merchant', isOverridden: true }
        : p
    ));
  };

  if (selectedProduct) {
    return (
      <ProductDetailPage 
        product={selectedProduct}
        isEditing={editingProduct}
        onBack={() => setSelectedProduct(null)}
        onEdit={handleEditProduct}
        onSave={handleSaveProduct}
        onReset={handleResetToDefault}
        onCancel={() => setEditingProduct(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">View and customize platform products for your practice</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Products</option>
                <option value="active">Active Only</option>
                <option value="overridden">Overridden</option>
                <option value="default">Admin Default</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Platform Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{product.name}</span>
                        {product.isOverridden && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            Overridden
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={product.status === 'active'}
                          onCheckedChange={(checked) => 
                            handleStatusToggle(product.id, checked ? 'active' : 'inactive')
                          }
                        />
                        <span className="text-sm">
                          {product.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {product.merchantPrice ? (
                          <div>
                            <div className="font-medium">${product.merchantPrice}</div>
                            <div className="text-sm text-gray-500 line-through">${product.adminPrice}</div>
                          </div>
                        ) : (
                          <div className="font-medium">${product.adminPrice}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{product.lastModified}</div>
                        <div className="text-xs text-gray-500">by {product.modifiedBy}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewProduct(product)}
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

// Product Detail Page Component
interface ProductDetailPageProps {
  product: Product;
  isEditing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: (product: Partial<Product>) => void;
  onReset: () => void;
  onCancel: () => void;
}

function ProductDetailPage({ product, isEditing, onBack, onEdit, onSave, onReset, onCancel }: ProductDetailPageProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    description: product.description || '',
    benefits: product.benefits || [],
    sideEffects: product.sideEffects || [],
    merchantPrice: product.merchantPrice || product.adminPrice,
    dosageOptions: product.dosageOptions || []
  });

  const [newBenefit, setNewBenefit] = useState('');
  const [newSideEffect, setNewSideEffect] = useState('');

  const handleSave = () => {
    onSave(formData);
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const addSideEffect = () => {
    if (newSideEffect.trim()) {
      setFormData(prev => ({
        ...prev,
        sideEffects: [...prev.sideEffects, newSideEffect.trim()]
      }));
      setNewSideEffect('');
    }
  };

  const removeSideEffect = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sideEffects: prev.sideEffects.filter((_, i) => i !== index)
    }));
  };

  const updateDosageOption = (index: number, field: string, value: string | boolean) => {
    const updatedOptions = [...formData.dosageOptions];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    
    if (field === 'isDefault' && value) {
      updatedOptions.forEach((opt, i) => {
        if (i !== index) opt.isDefault = false;
      });
    }
    
    setFormData(prev => ({ ...prev, dosageOptions: updatedOptions }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Products
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">{product.category}</p>
          </div>
          {product.isOverridden && (
            <Badge className="bg-yellow-100 text-yellow-800">
              Overridden
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          {product.isOverridden && !isEditing && (
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          )}
          {!isEditing ? (
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Images */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-sm text-gray-500">Product Image</p>
                </div>
              </div>
              {isEditing && (
                <Button variant="outline" className="w-full">
                  Upload New Image
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className={isEditing ? 'bg-yellow-50 border-yellow-200' : ''}>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-900">{product.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                {isEditing ? (
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Hormone Therapy">Hormone Therapy</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Recovery">Recovery</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{product.category}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                {isEditing ? (
                  <textarea
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                ) : (
                  <div>
                    <p className="text-gray-900">{product.description}</p>
                    {product.isOverridden && product.adminDescription !== product.description && (
                      <div className="mt-2 p-2 bg-gray-100 rounded">
                        <p className="text-xs text-gray-600">Original: {product.adminDescription}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className={isEditing ? 'bg-yellow-50 border-yellow-200' : ''}>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm">{benefit}</span>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                        className="text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add benefit"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                    />
                    <Button onClick={addBenefit} size="sm">Add</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Side Effects */}
          <Card className={isEditing ? 'bg-yellow-50 border-yellow-200' : ''}>
            <CardHeader>
              <CardTitle>Side Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.sideEffects.map((effect, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <span className="text-sm">{effect}</span>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSideEffect(index)}
                        className="text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add side effect"
                      value={newSideEffect}
                      onChange={(e) => setNewSideEffect(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSideEffect()}
                    />
                    <Button onClick={addSideEffect} size="sm">Add</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Dosage */}
          <Card className={isEditing ? 'bg-yellow-50 border-yellow-200' : ''}>
            <CardHeader>
              <CardTitle>Pricing & Dosage Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Price</label>
                    <div className="text-lg font-semibold text-gray-600">${product.adminPrice}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Price</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={formData.merchantPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, merchantPrice: e.target.value }))}
                      />
                    ) : (
                      <div className="text-lg font-semibold text-green-600">
                        ${product.merchantPrice || product.adminPrice}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Dosage Options</h4>
                  <div className="space-y-3">
                    {formData.dosageOptions.map((option, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{option.name}</span>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={option.isDefault}
                              onChange={(e) => updateDosageOption(index, 'isDefault', e.target.checked)}
                              disabled={!isEditing}
                            />
                            <span className="text-sm">Default</span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-500">Admin: ${option.adminPrice}</div>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={option.price}
                              onChange={(e) => updateDosageOption(index, 'price', e.target.value)}
                              className="w-20"
                            />
                          ) : (
                            <div className="font-semibold text-green-600">${option.price}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Products */}
          <Card>
            <CardHeader>
              <CardTitle>Related Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product.relatedProducts?.map((relatedProduct, index) => (
                  <Badge key={index} variant="outline">
                    {relatedProduct}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
