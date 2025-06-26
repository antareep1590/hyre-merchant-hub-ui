
import {
  BarChart3,
  Package,
  Tags,
  FileText,
  ClipboardList,
  Users,
  Building2,
  DollarSign,
  Menu,
  ChevronLeft
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
  SidebarTrigger,
  SidebarHeader
} from '@/components/ui/sidebar';
import { NavigationItem } from './DashboardLayout';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  activeItem: NavigationItem;
  onItemClick: (item: NavigationItem) => void;
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
    title: 'Subscribers',
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
];

export function AppSidebar({ activeItem, onItemClick }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Hyre Health</h1>
            <p className="text-xs text-gray-500">Merchant Portal</p>
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
                      "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activeItem === item.id
                        ? "bg-primary/10 text-primary border border-primary/20"
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
