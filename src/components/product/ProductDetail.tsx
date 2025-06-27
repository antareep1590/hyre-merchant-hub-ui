
import { useState } from 'react';
import { ArrowLeft, Edit2, RotateCcw, TestTube, Star, Truck, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  images?: string[];
  benefits?: string[];
  keyFeatures?: string[];
  purpose?: string;
  activeIngredients?: { name: string; dosage: string }[];
  inactiveIngredients?: string[];
  format?: string;
  dosagePerUse?: string;
  frequency?: string;
  timing?: string;
  faqs?: { question: string; answer: string }[];
  rating?: number;
  reviews?: { name: string; date: string; rating: number; text: string }[];
  shippingInfo?: string;
  returnPolicy?: string;
  freeShippingThreshold?: number;
}

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

interface OverrideState {
  description: boolean;
  ingredients: boolean;
  usage: boolean;
  faqs: boolean;
  shipping: boolean;
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<OverrideState>({
    description: false,
    ingredients: false,
    usage: false,
    faqs: false,
    shipping: false
  });

  // Local state for editable fields
  const [editableProduct, setEditableProduct] = useState(product);
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    ingredients: true,
    usage: true,
    faqs: true,
    reviews: true,
    shipping: true
  });

  const handleEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSave = (section: string) => {
    setEditingSection(null);
    setOverrides(prev => ({ ...prev, [section]: true }));
  };

  const handleReset = (section: string) => {
    setEditableProduct(product);
    setOverrides(prev => ({ ...prev, [section]: false }));
    setEditingSection(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{editableProduct.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary">{editableProduct.category}</Badge>
                  <Badge 
                    variant={editableProduct.status === 'active' ? 'default' : 'secondary'}
                    className={editableProduct.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {editableProduct.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">Preview as Patient</Button>
              <Button>Activate Product</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <TestTube className="h-16 w-16 text-gray-400" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded border"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Product Description */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle 
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSection('description')}
                >
                  Product Description
                  {expandedSections.description ? 
                    <ChevronUp className="h-4 w-4 ml-2" /> : 
                    <ChevronDown className="h-4 w-4 ml-2" />
                  }
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {overrides.description && <Badge variant="secondary">Overridden</Badge>}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editingSection === 'description' ? handleSave('description') : handleEdit('description')}
                  >
                    {editingSection === 'description' ? 'Save' : <Edit2 className="h-4 w-4" />}
                  </Button>
                  {overrides.description && (
                    <Button variant="ghost" size="sm" onClick={() => handleReset('description')}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <Collapsible open={expandedSections.description}>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {editingSection === 'description' ? (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Purpose</label>
                          <Textarea
                            value={editableProduct.purpose || ''}
                            onChange={(e) => setEditableProduct(prev => ({ ...prev, purpose: e.target.value }))}
                            placeholder="What is this product used for?"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Key Benefits</label>
                          <Textarea
                            value={editableProduct.benefits?.join('\n') || ''}
                            onChange={(e) => setEditableProduct(prev => ({ ...prev, benefits: e.target.value.split('\n') }))}
                            placeholder="List key benefits (one per line)"
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Description</label>
                          <Textarea
                            value={editableProduct.description || ''}
                            onChange={(e) => setEditableProduct(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Detailed product description"
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Purpose</h4>
                          <p className="text-gray-700">{editableProduct.purpose || 'No purpose specified'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Benefits</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {editableProduct.benefits?.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            )) || <li>No benefits listed</li>}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                          <p className="text-gray-700">{editableProduct.description || 'No description available'}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* 2. Ingredients / Composition */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle 
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSection('ingredients')}
                >
                  <TestTube className="h-5 w-5 mr-2" />
                  Ingredients & Composition
                  {expandedSections.ingredients ? 
                    <ChevronUp className="h-4 w-4 ml-2" /> : 
                    <ChevronDown className="h-4 w-4 ml-2" />
                  }
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {overrides.ingredients && <Badge variant="secondary">Overridden</Badge>}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editingSection === 'ingredients' ? handleSave('ingredients') : handleEdit('ingredients')}
                  >
                    {editingSection === 'ingredients' ? 'Save' : <Edit2 className="h-4 w-4" />}
                  </Button>
                  {overrides.ingredients && (
                    <Button variant="ghost" size="sm" onClick={() => handleReset('ingredients')}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <Collapsible open={expandedSections.ingredients}>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Active Ingredients</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ingredient</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Dosage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {editableProduct.activeIngredients?.map((ingredient, index) => (
                              <tr key={index} className="border-t">
                                <td className="px-4 py-2 text-sm text-gray-900">{ingredient.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{ingredient.dosage}</td>
                              </tr>
                            )) || (
                              <tr>
                                <td colSpan={2} className="px-4 py-2 text-sm text-gray-500 text-center">
                                  No active ingredients listed
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Inactive Ingredients</h4>
                      <p className="text-sm text-gray-700">
                        {editableProduct.inactiveIngredients?.join(', ') || 'No inactive ingredients listed'}
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* 3. Usage Instructions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle 
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSection('usage')}
                >
                  Usage Instructions
                  {expandedSections.usage ? 
                    <ChevronUp className="h-4 w-4 ml-2" /> : 
                    <ChevronDown className="h-4 w-4 ml-2" />
                  }
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {overrides.usage && <Badge variant="secondary">Overridden</Badge>}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editingSection === 'usage' ? handleSave('usage') : handleEdit('usage')}
                  >
                    {editingSection === 'usage' ? 'Save' : <Edit2 className="h-4 w-4" />}
                  </Button>
                  {overrides.usage && (
                    <Button variant="ghost" size="sm" onClick={() => handleReset('usage')}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <Collapsible open={expandedSections.usage}>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {editingSection === 'usage' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Format</label>
                          <Input
                            value={editableProduct.format || ''}
                            onChange={(e) => setEditableProduct(prev => ({ ...prev, format: e.target.value }))}
                            placeholder="e.g., Capsule, Injection"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Dosage per Use</label>
                          <Input
                            value={editableProduct.dosagePerUse || ''}
                            onChange={(e) => setEditableProduct(prev => ({ ...prev, dosagePerUse: e.target.value }))}
                            placeholder="e.g., 1 capsule, 0.25mg"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Frequency</label>
                          <Input
                            value={editableProduct.frequency || ''}
                            onChange={(e) => setEditableProduct(prev => ({ ...prev, frequency: e.target.value }))}
                            placeholder="e.g., Daily, Weekly"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Timing</label>
                          <Input
                            value={editableProduct.timing || ''}
                            onChange={(e) => setEditableProduct(prev => ({ ...prev, timing: e.target.value }))}
                            placeholder="e.g., After meals, Morning only"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Format</label>
                          <p className="text-sm text-gray-900 mt-1">{editableProduct.format || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Dosage per Use</label>
                          <p className="text-sm text-gray-900 mt-1">{editableProduct.dosagePerUse || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Frequency</label>
                          <p className="text-sm text-gray-900 mt-1">{editableProduct.frequency || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Timing</label>
                          <p className="text-sm text-gray-900 mt-1">{editableProduct.timing || 'Not specified'}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* 4. FAQs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle 
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSection('faqs')}
                >
                  Frequently Asked Questions
                  {expandedSections.faqs ? 
                    <ChevronUp className="h-4 w-4 ml-2" /> : 
                    <ChevronDown className="h-4 w-4 ml-2" />
                  }
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {overrides.faqs && <Badge variant="secondary">Overridden</Badge>}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editingSection === 'faqs' ? handleSave('faqs') : handleEdit('faqs')}
                  >
                    {editingSection === 'faqs' ? 'Save' : <Edit2 className="h-4 w-4" />}
                  </Button>
                  {overrides.faqs && (
                    <Button variant="ghost" size="sm" onClick={() => handleReset('faqs')}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <Collapsible open={expandedSections.faqs}>
                <CollapsibleContent>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {editableProduct.faqs?.map((faq, index) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      )) || (
                        <p className="text-gray-500 text-center py-8">No FAQs available</p>
                      )}
                    </Accordion>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* 5. Customer Reviews */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle 
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSection('reviews')}
                >
                  <div className="flex items-center">
                    Customer Reviews
                    <div className="flex items-center ml-2">
                      {renderStars(editableProduct.rating || 0)}
                      <span className="ml-2 text-sm text-gray-500">
                        ({editableProduct.rating || 0}/5)
                      </span>
                    </div>
                  </div>
                  {expandedSections.reviews ? 
                    <ChevronUp className="h-4 w-4 ml-2" /> : 
                    <ChevronDown className="h-4 w-4 ml-2" />
                  }
                </CardTitle>
              </CardHeader>
              <Collapsible open={expandedSections.reviews}>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {editableProduct.reviews?.map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{review.name}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.text}</p>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-8">No reviews available</p>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* 6. Shipping & Return Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle 
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSection('shipping')}
                >
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping & Returns
                  {expandedSections.shipping ? 
                    <ChevronUp className="h-4 w-4 ml-2" /> : 
                    <ChevronDown className="h-4 w-4 ml-2" />
                  }
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {overrides.shipping && <Badge variant="secondary">Overridden</Badge>}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editingSection === 'shipping' ? handleSave('shipping') : handleEdit('shipping')}
                  >
                    {editingSection === 'shipping' ? 'Save' : <Edit2 className="h-4 w-4" />}
                  </Button>
                  {overrides.shipping && (
                    <Button variant="ghost" size="sm" onClick={() => handleReset('shipping')}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <Collapsible open={expandedSections.shipping}>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {editingSection === 'shipping' ? (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Shipping Information</label>
                          <Textarea
                            value={editableProduct.shippingInfo || ''}
                            onChange={(e) => setEditableProduct(prev => ({ ...prev, shippingInfo: e.target.value }))}
                            placeholder="e.g., Ships within 2-5 business days"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Return Policy</label>
                          <Textarea
                            value={editableProduct.returnPolicy || ''}
                            onChange={(e) => setEditableProduct(prev => ({ ...prev, returnPolicy: e.target.value }))}
                            placeholder="Return policy details"
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Free Shipping Threshold ($)</label>
                          <Input
                            type="number"
                            value={editableProduct.freeShippingThreshold || ''}
                            onChange={(e) => setEditableProduct(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                            placeholder="e.g., 50"
                            className="mt-1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Shipping</h4>
                          <p className="text-gray-700 text-sm">
                            {editableProduct.shippingInfo || 'Standard shipping applies'}
                          </p>
                          {editableProduct.freeShippingThreshold && (
                            <p className="text-green-600 text-sm font-medium mt-1">
                              Free shipping over ${editableProduct.freeShippingThreshold}
                            </p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Returns</h4>
                          <p className="text-gray-700 text-sm">
                            {editableProduct.returnPolicy || 'Standard return policy applies'}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
