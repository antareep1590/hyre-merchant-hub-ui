
import { Bell, Search, User, ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface TopNavigationProps {
  merchantName: string;
}

export function TopNavigation({ merchantName }: TopNavigationProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search patients, products..."
                className="pl-10 w-80 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium text-sm">Dr. Smith</div>
                  <div className="text-xs text-gray-500">{merchantName}</div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border border-gray-200">
              <DropdownMenuItem className="hover:bg-gray-50">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50">Platform Settings</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50">Billing</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50">Help & Support</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 hover:bg-red-50">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
