
import { useState } from 'react';
import { X, Package, DollarSign, Tag, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  dosageOptions?: { name: string; price: string; isDefault: boolean }[];
}

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Image */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Product Image</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Product Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <span>Product Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">SKU</label>
                      <p className="text-sm text-gray-900 mt-1">{product.sku}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge 
                        variant={product.status === 'active' ? 'default' : 'secondary'}
                        className={`mt-1 ${product.status === 'active' ? 'bg-green-100 text-green-800' : ''}`}
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900 mt-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {product.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm text-gray-900 mt-1">{product.description || 'No description available'}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Dosage & Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Dosage & Pricing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.dosageOptions?.map((option, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{option.name}</span>
                          {option.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <span className="font-semibold text-green-600">${option.price}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
