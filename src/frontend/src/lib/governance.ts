import { Time } from '../backend';

const DISCUSSION_PERIOD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const VOTING_PERIOD_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export type ProposalPhase = 'discussion' | 'voting' | 'ended';

export function getProposalPhase(startTime: Time): ProposalPhase {
  const startMs = Number(startTime) / 1_000_000;
  const now = Date.now();
  const elapsed = now - startMs;

  if (elapsed < DISCUSSION_PERIOD_MS) {
    return 'discussion';
  } else if (elapsed < DISCUSSION_PERIOD_MS + VOTING_PERIOD_MS) {
    return 'voting';
  } else {
    return 'ended';
  }
}

export function formatCountdown(startTime: Time, phase: ProposalPhase): string {
  const startMs = Number(startTime) / 1_000_000;
  const now = Date.now();
  const elapsed = now - startMs;

  let remainingMs: number;

  if (phase === 'discussion') {
    remainingMs = DISCUSSION_PERIOD_MS - elapsed;
  } else if (phase === 'voting') {
    remainingMs = DISCUSSION_PERIOD_MS + VOTING_PERIOD_MS - elapsed;
  } else {
    return 'Ended';
  }

  if (remainingMs <= 0) return 'Ending soon';

  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  }
  return `${hours}h remaining`;
}
