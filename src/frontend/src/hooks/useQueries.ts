import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NewWorkLog, WorkLogCategory, UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

// Citizen queries
export function useOnboardCitizen() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.onboardCitizen(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizenId'] });
      toast.success('Successfully onboarded as a SUZHI citizen!');
    },
    onError: (error: Error) => {
      if (error.message.includes('already registered')) {
        toast.error('You are already registered as a citizen');
      } else {
        toast.error('Failed to onboard: ' + error.message);
      }
    }
  });
}

export function useGetCitizenId(principal?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['citizenId', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) throw new Error('Actor or principal not available');
      return actor.getCitizenIdByPrincipal(principal);
    },
    enabled: !!actor && !actorFetching && !!principal,
    retry: false
  });
}

// Wallet queries
export function useGetBalance(principal?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['balance', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) throw new Error('Actor or principal not available');
      try {
        const balance = await actor.getBalance(principal);
        return balance;
      } catch (error: any) {
        // If unauthorized or other backend error, throw to surface it
        if (error.message?.includes('Unauthorized')) {
          throw error;
        }
        // For other errors, log and return 0 as fallback
        console.error('Error fetching balance:', error);
        return BigInt(0);
      }
    },
    enabled: !!actor && !actorFetching && !!principal,
    retry: false
  });
}

export function useTransfer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ to, amount }: { to: Principal; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Validate amount is positive
      if (amount <= BigInt(0)) {
        throw new Error('Amount must be greater than zero');
      }
      
      await actor.transfer(to, amount);
    },
    onSuccess: () => {
      // Invalidate all balance queries to refresh sender and recipient balances
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast.success('Transfer successful!');
    },
    onError: (error: Error) => {
      // Map backend errors to user-friendly English messages
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('Insufficient balance')) {
        toast.error('Insufficient balance. You do not have enough SUZHI tokens for this transfer.');
      } else if (errorMessage.includes('Unauthorized')) {
        toast.error('You must be logged in to transfer tokens.');
      } else if (errorMessage.includes('Amount must be greater than zero')) {
        toast.error('Transfer amount must be greater than zero.');
      } else {
        toast.error('Transfer failed: ' + errorMessage);
      }
    }
  });
}

// Work log queries
export function useGetAllWorkLogs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['workLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWorkLogs();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useGetWorkLogsByCategory(category: WorkLogCategory) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['workLogs', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkLogsByCategory(category);
    },
    enabled: !!actor && !actorFetching
  });
}

export function useCreateWorkLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NewWorkLog) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWorkLog(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
      toast.success('Work log created successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to create work log: ' + error.message);
    }
  });
}

export function useValidateWorkLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workLogId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.validateWorkLog(workLogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast.success('Work log verified! Reward will be distributed when fully verified.');
    },
    onError: (error: Error) => {
      if (error.message.includes('Cannot validate own')) {
        toast.error('You cannot verify your own work log');
      } else if (error.message.includes('Cannot validate twice')) {
        toast.error('You have already verified this work log');
      } else {
        toast.error('Verification failed: ' + error.message);
      }
    }
  });
}

// DAO queries
export function useGetAllProposals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDAOProposals();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useSubmitProposal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      budget,
      startTime
    }: {
      title: string;
      description: string;
      budget: bigint;
      startTime: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitProposal(title, description, budget, startTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Proposal submitted successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to submit proposal: ' + error.message);
    }
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to save profile: ' + error.message);
    }
  });
}
