
import { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical, Check, X, ArrowUp, ArrowDown, Upload, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface Category {
  id: number;
  name: string;
  description?: string;
  photo?: string;
  productCount: number;
  order: number;
  color: string;
  isPopular?: boolean;
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Weight Loss', description: 'Products to help with weight management and metabolism', productCount: 5, order: 1, color: 'bg-blue-100 text-blue-800' },
    { id: 2, name: 'Hormone Therapy', description: 'Hormone replacement and balance treatments', productCount: 8, order: 2, color: 'bg-green-100 text-green-800' },
    { id: 3, name: 'Skincare', description: 'Advanced skincare and anti-aging solutions', productCount: 3, order: 3, color: 'bg-purple-100 text-purple-800' },
    { id: 4, name: 'Recovery', description: 'Recovery and wellness optimization products', productCount: 4, order: 4, color: 'bg-orange-100 text-orange-800' },
    { id: 5, name: 'Wellness', description: 'General wellness and preventive care', productCount: 6, order: 5, color: 'bg-pink-100 text-pink-800' }
  ]);

  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryPhoto, setNewCategoryPhoto] = useState<File | null>(null);
  const [newCategoryPhotoPreview, setNewCategoryPhotoPreview] = useState<string>('');
  const [newCategoryIsPopular, setNewCategoryIsPopular] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingName, setEditingName] = useState('');

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewCategoryPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewCategoryPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setNewCategoryPhoto(null);
    setNewCategoryPhotoPreview('');
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: newCategoryName,
        description: newCategoryDescription.trim() || undefined,
        photo: newCategoryPhotoPreview || undefined,
        productCount: 0,
        order: categories.length + 1,
        color: 'bg-gray-100 text-gray-800',
        isPopular: newCategoryIsPopular
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setNewCategoryPhoto(null);
      setNewCategoryPhotoPreview('');
      setNewCategoryIsPopular(false);
      setIsAdding(false);
    }
  };

  const handleEditCategory = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setEditingCategory(categoryId);
      setEditingName(category.name);
    }
  };

  const handleSaveCategory = (categoryId: number) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, name: editingName } : c
    ));
    setEditingCategory(null);
    setEditingName('');
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const moveCategory = (categoryId: number, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (
      (direction === 'up' && categoryIndex > 0) ||
      (direction === 'down' && categoryIndex < categories.length - 1)
    ) {
      const newCategories = [...categories];
      const swapIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1;
      
      // Swap the categories
      [newCategories[categoryIndex], newCategories[swapIndex]] = 
      [newCategories[swapIndex], newCategories[categoryIndex]];
      
      // Update their order values
      newCategories[categoryIndex].order = categoryIndex + 1;
      newCategories[swapIndex].order = swapIndex + 1;
      
      setCategories(newCategories);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Organize your products into categories</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Add New Category */}
      {isAdding && (
        <Card className="border-2 border-blue-200 shadow-lg animate-fade-in">
          <CardHeader className="bg-blue-50">
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <Input
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Enter category description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Photo
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearPhoto}
                      disabled={!newCategoryPhoto}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {newCategoryPhotoPreview && (
                    <div className="mt-2">
                      <img 
                        src={newCategoryPhotoPreview} 
                        alt="Category preview" 
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPopular"
                  checked={newCategoryIsPopular}
                  onCheckedChange={(checked) => setNewCategoryIsPopular(checked as boolean)}
                />
                <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">
                  Mark as Popular Category
                </label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700">
                  <Check className="h-4 w-4 mr-2" />
                  Save Category
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setNewCategoryName('');
                    setNewCategoryDescription('');
                    setNewCategoryPhoto(null);
                    setNewCategoryPhotoPreview('');
                    setNewCategoryIsPopular(false);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Categories ({categories.length})</CardTitle>
          <p className="text-sm text-gray-600">Use the arrow buttons to reorder categories</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  
                  {category.photo && (
                    <img 
                      src={category.photo} 
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  )}
                  
                  <div className="flex flex-col space-y-1">
                    {editingCategory === category.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveCategory(category.id)}
                          className="w-48"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleSaveCategory(category.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingCategory(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                         <div className="flex items-center space-x-3">
                           <div className="flex items-center space-x-2">
                             <Badge className={category.color}>
                               {category.name}
                             </Badge>
                             {category.isPopular && (
                               <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                             )}
                           </div>
                           <span className="text-sm text-gray-500">
                             {category.productCount} products
                           </span>
                         </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 max-w-md">
                            {category.description}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {editingCategory !== category.id && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => moveCategory(category.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => moveCategory(category.id, 'down')}
                      disabled={index === categories.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditCategory(category.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
