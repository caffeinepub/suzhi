import { WorkLogCategory, ValidationStatus, WorkLogTimeSpan } from '../backend';

export function getCategoryLabel(category: WorkLogCategory): string {
  const categoryMap: Record<WorkLogCategory, string> = {
    [WorkLogCategory.physical]: 'Physical Labor',
    [WorkLogCategory.knowledge]: 'Knowledge Work',
    [WorkLogCategory.creative]: 'Creative & Cultural',
    [WorkLogCategory.wellness]: 'Care & Wellness'
  };
  return categoryMap[category] || category;
}

export function getStatusLabel(status: ValidationStatus): string {
  const statusMap: Record<ValidationStatus, string> = {
    [ValidationStatus.pending]: 'Pending Verification',
    [ValidationStatus.completed]: 'Completed & Rewarded'
  };
  return statusMap[status] || status;
}

export function formatTimeSpent(timeSpan: WorkLogTimeSpan): string {
  const startMs = Number(timeSpan.startTime) / 1_000_000;
  const endMs = Number(timeSpan.endTime) / 1_000_000;
  const durationMs = endMs - startMs;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  const startDate = new Date(startMs);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (hours > 0) {
    return `${formattedDate} • ${hours}h ${minutes}m`;
  }
  return `${formattedDate} • ${minutes}m`;
}
