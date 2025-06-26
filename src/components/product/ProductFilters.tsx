
import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductFiltersProps {
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export function ProductFilters({ onClose, onApplyFilters }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const categories = ['Weight Loss', 'Hormone Therapy', 'Skincare', 'Recovery', 'Wellness'];
  const statuses = ['active', 'draft', 'inactive'];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      categories: selectedCategories,
      statuses: selectedStatus
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedStatus([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Products</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Status</h3>
            <div className="space-y-2">
              {statuses.map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClear} className="flex-1">
              Clear All
            </Button>
            <Button onClick={handleApply} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
