
import { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: number;
  name: string;
  productCount: number;
  order: number;
  color: string;
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Weight Loss', productCount: 5, order: 1, color: 'bg-blue-100 text-blue-800' },
    { id: 2, name: 'Hormone Therapy', productCount: 8, order: 2, color: 'bg-green-100 text-green-800' },
    { id: 3, name: 'Skincare', productCount: 3, order: 3, color: 'bg-purple-100 text-purple-800' },
    { id: 4, name: 'Recovery', productCount: 4, order: 4, color: 'bg-orange-100 text-orange-800' },
    { id: 5, name: 'Wellness', productCount: 6, order: 5, color: 'bg-pink-100 text-pink-800' }
  ]);

  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingName, setEditingName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: newCategoryName,
        productCount: 0,
        order: categories.length + 1,
        color: 'bg-gray-100 text-gray-800'
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700">
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setNewCategoryName('');
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
                  <div className="flex items-center space-x-3">
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
                        <Badge className={category.color}>
                          {category.name}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {category.productCount} products
                        </span>
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
