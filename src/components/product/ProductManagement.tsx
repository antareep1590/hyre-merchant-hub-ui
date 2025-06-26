
import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, X, Check, ChevronDown, ChevronUp, Upload } from 'lucide-react';
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
import { ProductDetail } from './ProductDetail';
import { ProductFilters } from './ProductFilters';

interface Product {
  id: number;
  name: string;
  category: string;
  priceRange: string;
  status: 'active' | 'draft' | 'inactive';
  dosages: number;
  lastUpdated: string;
  description?: string;
  sku?: string;
  price?: string;
  dosageOptions?: { name: string; price: string; isDefault: boolean }[];
}

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Semaglutide Weight Management',
      category: 'Weight Loss',
      priceRange: '$200 - $400',
      status: 'active',
      dosages: 3,
      lastUpdated: '2 days ago',
      description: 'Comprehensive weight management program with medical supervision',
      sku: 'SEM-WM-001',
      price: '200',
      dosageOptions: [
        { name: '0.25mg', price: '200', isDefault: true },
        { name: '0.5mg', price: '300', isDefault: false },
        { name: '1.0mg', price: '400', isDefault: false }
      ]
    },
    {
      id: 2,
      name: 'Testosterone Replacement Therapy',
      category: 'Hormone Therapy',
      priceRange: '$150 - $300',
      status: 'active',
      dosages: 4,
      lastUpdated: '1 week ago',
      description: 'Personalized hormone optimization for men',
      sku: 'TRT-HT-002',
      price: '150',
      dosageOptions: [
        { name: '100mg/week', price: '150', isDefault: true },
        { name: '150mg/week', price: '200', isDefault: false },
        { name: '200mg/week', price: '250', isDefault: false },
        { name: '250mg/week', price: '300', isDefault: false }
      ]
    }
  ]);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Weight Loss',
    description: '',
    sku: '',
    price: '',
    status: 'draft',
    dosageOptions: []
  });

  const categories = ['Weight Loss', 'Hormone Therapy', 'Skincare', 'Recovery', 'Wellness'];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditProduct = (productId: number) => {
    setEditingProduct(editingProduct === productId ? null : productId);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  const handleSaveProduct = (productId: number, updatedData: Partial<Product>) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, ...updatedData, lastUpdated: 'Just now' } : p
    ));
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category) {
      const product: Product = {
        id: products.length + 1,
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description || '',
        sku: newProduct.sku || `${newProduct.name?.slice(0, 3).toUpperCase()}-${Date.now()}`,
        price: newProduct.price || '0',
        priceRange: newProduct.dosageOptions?.length ? 
          `$${Math.min(...newProduct.dosageOptions.map(d => parseInt(d.price)))} - $${Math.max(...newProduct.dosageOptions.map(d => parseInt(d.price)))}` 
          : `$${newProduct.price || '0'}`,
        status: newProduct.status as 'active' | 'draft' | 'inactive',
        dosages: newProduct.dosageOptions?.length || 0,
        lastUpdated: 'Just now',
        dosageOptions: newProduct.dosageOptions || []
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', category: 'Weight Loss', description: '', sku: '', price: '', status: 'draft', dosageOptions: [] });
      setShowAddForm(false);
    }
  };

  const ProductEditForm = ({ product, onSave, onCancel }: { product: Product; onSave: (data: Partial<Product>) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState<Partial<Product>>({
      ...product,
      dosageOptions: product.dosageOptions || []
    });

    const addDosageOption = () => {
      setFormData({
        ...formData,
        dosageOptions: [...(formData.dosageOptions || []), { name: '', price: '', isDefault: false }]
      });
    };

    const updateDosageOption = (index: number, field: string, value: string | boolean) => {
      const updatedOptions = [...(formData.dosageOptions || [])];
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
      if (field === 'isDefault' && value) {
        updatedOptions.forEach((opt, i) => {
          if (i !== index) opt.isDefault = false;
        });
      }
      setFormData({ ...formData, dosageOptions: updatedOptions });
    };

    const removeDosageOption = (index: number) => {
      const updatedOptions = formData.dosageOptions?.filter((_, i) => i !== index) || [];
      setFormData({ ...formData, dosageOptions: updatedOptions });
    };

    return (
      <div className="border-t-2 border-blue-200 bg-blue-50/30 p-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <Input 
                value={formData.name || ''} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={formData.category || ''} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <Input 
                value={formData.sku || ''} 
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Price</label>
              <Input 
                type="number"
                value={formData.price || ''} 
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="border-gray-300 focus:ring-blue-500"
                placeholder="Base product price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'inactive' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">Click to upload image</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Dosage & Pricing</h3>
              <Button onClick={addDosageOption} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Dosage
              </Button>
            </div>
            <div className="space-y-3">
              {formData.dosageOptions?.map((option, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg bg-white">
                  <Input 
                    placeholder="Dosage (e.g., 0.25mg)" 
                    value={option.name}
                    onChange={(e) => updateDosageOption(index, 'name', e.target.value)}
                    className="w-32"
                  />
                  <Input 
                    placeholder="Price" 
                    value={option.price}
                    onChange={(e) => updateDosageOption(index, 'price', e.target.value)}
                    className="w-24"
                  />
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={option.isDefault}
                      onChange={(e) => updateDosageOption(index, 'isDefault', e.target.checked)}
                    />
                    <span className="text-sm">Default</span>
                  </label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeDosageOption(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(formData)} className="bg-blue-600 hover:bg-blue-700">
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your digital health products and services</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-200 shadow-lg animate-fade-in">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center justify-between">
              <CardTitle>Add New Product</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <Input 
                    value={newProduct.name || ''} 
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select 
                    value={newProduct.category || 'Weight Loss'} 
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Price</label>
                  <Input 
                    type="number"
                    value={newProduct.price || ''} 
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Base product price"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <Input 
                    value={newProduct.sku || ''} 
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">Click to upload</p>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Dosages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <>
                    <TableRow key={product.id} className={editingProduct === product.id ? 'bg-blue-50/50' : ''}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{product.priceRange}</TableCell>
                      <TableCell>{product.dosages} options</TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.status === 'active' ? 'default' : 'secondary'}
                          className={product.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">{product.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewProduct(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditProduct(product.id)}
                            className={editingProduct === product.id ? 'bg-blue-100 text-blue-700' : ''}
                          >
                            {editingProduct === product.id ? <ChevronUp className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {editingProduct === product.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="p-0">
                          <ProductEditForm 
                            product={product}
                            onSave={(data) => handleSaveProduct(product.id, data)}
                            onCancel={() => setEditingProduct(null)}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {viewingProduct && (
        <ProductDetail 
          product={viewingProduct} 
          onClose={() => setViewingProduct(null)} 
        />
      )}

      {showFilters && (
        <ProductFilters 
          onClose={() => setShowFilters(false)}
          onApplyFilters={(filters) => {
            console.log('Applying filters:', filters);
          }}
        />
      )}
    </div>
  );
}
