import { useGetAllProposals } from '../../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, TrendingUp, User, Coins } from 'lucide-react';
import { getProposalPhase, formatCountdown } from '../../lib/governance';

export default function ProposalList() {
  const { data: proposals, isLoading } = useGetAllProposals();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No proposals yet. Be the first to submit one!</p>
      </div>
    );
  }

  const sortedProposals = [...proposals].sort((a, b) => {
    const aTime = Number(a.startTime);
    const bTime = Number(b.startTime);
    return bTime - aTime;
  });

  return (
    <div className="space-y-4">
      {sortedProposals.map((proposal) => {
        const phase = getProposalPhase(proposal.startTime);
        const countdown = formatCountdown(proposal.startTime, phase);
        const totalVotes = Number(proposal.yesVotes) + Number(proposal.noVotes);
        const yesPercentage = totalVotes > 0 ? (Number(proposal.yesVotes) / totalVotes) * 100 : 0;

        return (
          <Card key={proposal.id.toString()} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">{proposal.title}</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {proposal.proposer.toString().slice(0, 12)}...
                  </CardDescription>
                </div>
                <Badge
                  variant={phase === 'voting' ? 'default' : 'secondary'}
                  className={
                    phase === 'discussion'
                      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      : phase === 'voting'
                        ? 'gold-gradient text-brown'
                        : 'bg-muted'
                  }
                >
                  {phase === 'discussion' ? 'Discussion' : phase === 'voting' ? 'Voting' : 'Ended'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground line-clamp-2">{proposal.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  Budget: {proposal.budget.toString()} SUZHI
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {countdown}
                </div>
              </div>

              {totalVotes > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-500">Yes: {proposal.yesVotes.toString()}</span>
                    <span className="text-red-500">No: {proposal.noVotes.toString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                      style={{ width: `${yesPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
