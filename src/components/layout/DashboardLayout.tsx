
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopNavigation } from './TopNavigation';
import { DashboardHome } from '../dashboard/DashboardHome';
import { ProductManagement } from '../product/ProductManagement';
import { CategoryManagement } from '../category/CategoryManagement';
import { QuestionnaireBuilder } from '../questionnaire/QuestionnaireBuilder';
import { IntakeForms } from '../intake/IntakeForms';
import { SubscriberManagement } from '../subscriber/SubscriberManagement';
import { PharmacyRouting } from '../pharmacy/PharmacyRouting';
import { PayoutsTransactions } from '../payouts/PayoutsTransactions';

export type NavigationItem = 
  | 'dashboard' 
  | 'products' 
  | 'categories' 
  | 'questionnaire' 
  | 'intake-forms' 
  | 'subscribers' 
  | 'pharmacy' 
  | 'payouts';

const DashboardLayout = () => {
  const [activeItem, setActiveItem] = useState<NavigationItem>('dashboard');
  const [merchantName] = useState('Elite Wellness Clinic'); // This would come from merchant settings

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardHome onNavigate={setActiveItem} />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'questionnaire':
        return <QuestionnaireBuilder />;
      case 'intake-forms':
        return <IntakeForms />;
      case 'subscribers':
        return <SubscriberManagement />;
      case 'pharmacy':
        return <PharmacyRouting />;
      case 'payouts':
        return <PayoutsTransactions />;
      default:
        return <DashboardHome onNavigate={setActiveItem} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50/50 font-inter">
        <AppSidebar 
          activeItem={activeItem} 
          onItemClick={setActiveItem}
          merchantName={merchantName}
        />
        <div className="flex-1 flex flex-col">
          <TopNavigation merchantName={merchantName} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
