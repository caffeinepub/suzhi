import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateWorkLog } from '../../hooks/useQueries';
import { WorkLogCategory } from '../../backend';
import { getCategoryLabel } from '../../lib/workLog';

export default function WorkLogForm() {
  const [category, setCategory] = useState<WorkLogCategory | ''>('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const createMutation = useCreateWorkLog();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    createMutation.mutate(
      {
        category: category as WorkLogCategory,
        description,
        time: {
          startTime: BigInt(startDate.getTime() * 1_000_000),
          endTime: BigInt(endDate.getTime() * 1_000_000)
        }
      },
      {
        onSuccess: () => {
          setCategory('');
          setDescription('');
          setStartTime('');
          setEndTime('');
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(value) => setCategory(value as WorkLogCategory)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select work category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={WorkLogCategory.physical}>{getCategoryLabel(WorkLogCategory.physical)}</SelectItem>
            <SelectItem value={WorkLogCategory.knowledge}>{getCategoryLabel(WorkLogCategory.knowledge)}</SelectItem>
            <SelectItem value={WorkLogCategory.creative}>{getCategoryLabel(WorkLogCategory.creative)}</SelectItem>
            <SelectItem value={WorkLogCategory.wellness}>{getCategoryLabel(WorkLogCategory.wellness)}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the work you completed..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full gold-gradient text-brown font-semibold"
        disabled={createMutation.isPending || !category}
      >
        {createMutation.isPending ? 'Creating...' : 'Submit Work Log'}
      </Button>
    </form>
  );
}
