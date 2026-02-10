import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUser';
import { useGetCitizenId, useOnboardCitizen } from '../../hooks/useQueries';
import { User, Hash, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserProfileCard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const principal = identity?.getPrincipal();
  const { data: citizenId, isLoading: citizenIdLoading, error: citizenIdError } = useGetCitizenId(principal);
  const onboardMutation = useOnboardCitizen();

  const isOnboarded = citizenId !== undefined && !citizenIdError;
  const needsOnboarding = !isOnboarded && !citizenIdLoading;

  const handleOnboard = () => {
    if (principal) {
      onboardMutation.mutate(principal);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-earth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-gold" />
            Citizen Profile
          </CardTitle>
          <CardDescription>Your SUZHI identity and credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="text-lg font-semibold text-foreground">{userProfile?.name || 'Unknown'}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  Citizen ID
                </label>
                {citizenIdLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : isOnboarded ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-lg font-mono border-gold text-gold">
                      #{citizenId.toString()}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                ) : needsOnboarding ? (
                  <div className="mt-2">
                    <Button
                      onClick={handleOnboard}
                      disabled={onboardMutation.isPending}
                      className="gold-gradient text-brown font-semibold"
                    >
                      {onboardMutation.isPending ? 'Onboarding...' : 'Become a Citizen'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Register to receive your unique citizen ID
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-earth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" />
            Principal ID
          </CardTitle>
          <CardDescription>Your Internet Identity principal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-3 rounded-md break-all font-mono text-xs">
            {principal?.toString() || 'Not available'}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This is your unique blockchain identity on the Internet Computer
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
