import { useGetAllWorkLogs, useValidateWorkLog } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, Award } from 'lucide-react';
import { getCategoryLabel, formatTimeSpent, getStatusLabel } from '../../lib/workLog';
import { ValidationStatus } from '../../backend';

export default function WorkLogList() {
  const { data: workLogs, isLoading } = useGetAllWorkLogs();
  const { identity } = useInternetIdentity();
  const validateMutation = useValidateWorkLog();
  const currentPrincipal = identity?.getPrincipal();

  const handleVerify = (logId: bigint) => {
    validateMutation.mutate(logId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!workLogs || workLogs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No work logs yet. Create your first contribution!</p>
      </div>
    );
  }

  const sortedLogs = [...workLogs].sort((a, b) => {
    const aTime = Number(a.time.startTime);
    const bTime = Number(b.time.startTime);
    return bTime - aTime;
  });

  return (
    <div className="space-y-4">
      {sortedLogs.map((log) => {
        const isOwner = currentPrincipal?.toString() === log.worker.toString();
        const verificationCount = Number(log.validations);
        const isCompleted = log.status === ValidationStatus.completed;

        return (
          <Card key={log.id.toString()} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="outline" className="border-gold text-gold">
                      {getCategoryLabel(log.category)}
                    </Badge>
                    {isCompleted && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <Award className="w-3 h-3 mr-1" />
                        Rewarded
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {formatTimeSpent(log.time)} • {getStatusLabel(log.status)}
                  </CardDescription>
                </div>
                <Badge variant={isCompleted ? 'default' : 'secondary'} className="text-xs">
                  {verificationCount}/2 Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground">{log.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground font-mono">
                  Worker: {log.worker.toString().slice(0, 12)}...
                </span>
                {!isOwner && !isCompleted && (
                  <Button
                    size="sm"
                    onClick={() => handleVerify(log.id)}
                    disabled={validateMutation.isPending}
                    className="gold-gradient text-brown font-semibold"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {validateMutation.isPending ? 'Verifying...' : 'Verify'}
                  </Button>
                )}
                {isOwner && (
                  <Badge variant="outline" className="text-xs">
                    Your Work
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
