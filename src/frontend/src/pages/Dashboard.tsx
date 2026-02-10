import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppShell from '../components/layout/AppShell';
import UserProfileCard from '../components/profile/UserProfileCard';
import TokenWalletCard from '../components/wallet/TokenWalletCard';
import ContributionLogger from '../components/contributions/ContributionLogger';
import GovernancePortal from '../components/governance/GovernancePortal';
import { User, Wallet, Briefcase, Vote } from 'lucide-react';

export default function Dashboard() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 p-1">
            <TabsTrigger value="profile" className="data-[state=active]:gold-gradient data-[state=active]:text-brown">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:gold-gradient data-[state=active]:text-brown">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="contributions" className="data-[state=active]:gold-gradient data-[state=active]:text-brown">
              <Briefcase className="w-4 h-4 mr-2" />
              Contributions
            </TabsTrigger>
            <TabsTrigger value="governance" className="data-[state=active]:gold-gradient data-[state=active]:text-brown">
              <Vote className="w-4 h-4 mr-2" />
              Governance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="animate-fade-in">
            <UserProfileCard />
          </TabsContent>

          <TabsContent value="wallet" className="animate-fade-in">
            <TokenWalletCard />
          </TabsContent>

          <TabsContent value="contributions" className="animate-fade-in">
            <ContributionLogger />
          </TabsContent>

          <TabsContent value="governance" className="animate-fade-in">
            <GovernancePortal />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
