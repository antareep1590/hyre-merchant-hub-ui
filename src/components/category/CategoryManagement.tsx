
import { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function CategoryManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Weight Loss', productCount: 5, order: 1, color: 'bg-blue-100 text-blue-800' },
    { id: 2, name: 'Hormone Therapy', productCount: 8, order: 2, color: 'bg-green-100 text-green-800' },
    { id: 3, name: 'Skincare', productCount: 3, order: 3, color: 'bg-purple-100 text-purple-800' },
    { id: 4, name: 'Recovery', productCount: 4, order: 4, color: 'bg-orange-100 text-orange-800' },
    { id: 5, name: 'Wellness', productCount: 6, order: 5, color: 'bg-pink-100 text-pink-800' }
  ]);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: categories.length + 1,
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

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
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
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Add New Category */}
      {isAdding && (
        <Card className="border-0 shadow-sm">
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
                <Button onClick={handleAddCategory}>Save</Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setNewCategoryName('');
                  }}
                >
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
          <p className="text-sm text-gray-600">Drag to reorder categories</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  <div className="flex items-center space-x-3">
                    <Badge className={category.color}>
                      {category.name}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {category.productCount} products
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Assignment */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Product Assignment</CardTitle>
          <p className="text-sm text-gray-600">Assign products to categories</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Unassigned Products</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="p-3 border rounded-lg">
                  <span className="font-medium">New Skincare Product</span>
                  <p className="text-sm text-gray-500">No category assigned</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="font-medium">Custom Peptide Mix</span>
                  <p className="text-sm text-gray-500">No category assigned</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  Bulk Assign Categories
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Import Categories from CSV
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Export Category Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
