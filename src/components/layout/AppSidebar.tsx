import {
  BarChart3,
  Package,
  Tags,
  FileText,
  ClipboardList,
  Users,
  Building2,
  DollarSign,
  Ticket,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from '@/components/ui/sidebar';
import { NavigationItem } from './DashboardLayout';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  activeItem: NavigationItem;
  onItemClick: (item: NavigationItem) => void;
  merchantName: string;
}

const menuItems = [
  {
    id: 'dashboard' as NavigationItem,
    title: 'Dashboard',
    icon: BarChart3,
  },
  {
    id: 'products' as NavigationItem,
    title: 'Products',
    icon: Package,
  },
  {
    id: 'categories' as NavigationItem,
    title: 'Categories',
    icon: Tags,
  },
  {
    id: 'questionnaire' as NavigationItem,
    title: 'Questionnaire Builder',
    icon: FileText,
  },
  {
    id: 'intake-forms' as NavigationItem,
    title: 'Intake Forms',
    icon: ClipboardList,
  },
  {
    id: 'subscribers' as NavigationItem,
    title: 'Patients',
    icon: Users,
  },
  {
    id: 'pharmacy' as NavigationItem,
    title: 'Pharmacy Routing',
    icon: Building2,
  },
  {
    id: 'payouts' as NavigationItem,
    title: 'Payouts',
    icon: DollarSign,
  },
  {
    id: 'coupons' as NavigationItem,
    title: 'Coupons',
    icon: Ticket,
  },
];

export function AppSidebar({ activeItem, onItemClick, merchantName }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {merchantName.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">{merchantName}</h1>
            <p className="text-xs text-gray-500">Health Portal</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onItemClick(item.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1",
                      activeItem === item.id
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
