import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkLogForm from './WorkLogForm';
import WorkLogList from './WorkLogList';
import { Plus, List } from 'lucide-react';

export default function ContributionLogger() {
  return (
    <Card className="shadow-earth">
      <CardHeader>
        <CardTitle>Proof of Contribution</CardTitle>
        <CardDescription>
          Log your work and verify others' contributions to earn SUZHI tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="data-[state=active]:gold-gradient data-[state=active]:text-brown">
              <List className="w-4 h-4 mr-2" />
              View Logs
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:gold-gradient data-[state=active]:text-brown">
              <Plus className="w-4 h-4 mr-2" />
              Create Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <WorkLogList />
          </TabsContent>

          <TabsContent value="create">
            <WorkLogForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
