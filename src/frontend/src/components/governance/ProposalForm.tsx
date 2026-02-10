import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitProposal } from '../../hooks/useQueries';

export default function ProposalForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const submitMutation = useSubmitProposal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    const startTime = BigInt(now * 1_000_000);

    submitMutation.mutate(
      {
        title,
        description,
        budget: BigInt(budget),
        startTime
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setBudget('');
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Proposal Title</Label>
        <Input
          id="title"
          placeholder="Enter a clear, concise title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your proposal, expected outcomes, and implementation plan..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget (SUZHI Tokens)</Label>
        <Input
          id="budget"
          type="number"
          placeholder="Enter required budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
          min="0"
        />
      </div>

      <div className="bg-muted/30 p-4 rounded-md space-y-2 text-sm">
        <p className="font-semibold text-foreground">Proposal Timeline:</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• 7-day discussion period for community review</li>
          <li>• 5-day voting period following discussion</li>
          <li>• Automatic execution if approved (&gt;50% votes)</li>
        </ul>
      </div>

      <Button
        type="submit"
        className="w-full gold-gradient text-brown font-semibold"
        disabled={submitMutation.isPending}
      >
        {submitMutation.isPending ? 'Submitting...' : 'Submit Proposal'}
      </Button>
    </form>
  );
}
