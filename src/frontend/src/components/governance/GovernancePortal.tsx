import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProposalForm from './ProposalForm';
import ProposalList from './ProposalList';
import { Plus, List } from 'lucide-react';

export default function GovernancePortal() {
  return (
    <Card className="shadow-earth">
      <CardHeader>
        <CardTitle>DAO Governance</CardTitle>
        <CardDescription>
          Democratic governance powered by the people, for the people. One token, one vote.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="data-[state=active]:gold-gradient data-[state=active]:text-brown">
              <List className="w-4 h-4 mr-2" />
              View Proposals
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:gold-gradient data-[state=active]:text-brown">
              <Plus className="w-4 h-4 mr-2" />
              Create Proposal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <ProposalList />
          </TabsContent>

          <TabsContent value="create">
            <ProposalForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
