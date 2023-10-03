import { listResults } from "@/services/mockAnalysisApi";
import { readStorage, writeStorage } from "@/services/mockStorage";
import type { ComplianceStatus } from "@/types/compliance";

const readIdsKey = "read-notification-ids";

export interface AppNotification {
  id: string;
  analysisId: string;
  title: string;
  description: string;
  createdAt: string;
  status: ComplianceStatus;
}

export function listNotifications(): AppNotification[] {
  return listResults().slice(0, 6).map((result) => ({
    id: `analysis-${result.analysisId}`,
    analysisId: result.analysisId,
    title: result.package.productName,
    description: "Compliance screening completed",
    createdAt: result.analyzedAt,
    status: result.status,
  }));
}

export function getReadNotificationIds(): string[] {
  return readStorage<string[]>(readIdsKey, []);
}

export function markNotificationRead(notificationId: string): string[] {
  const nextIds = Array.from(new Set([...getReadNotificationIds(), notificationId]));
  writeStorage(readIdsKey, nextIds);
  return nextIds;
}

export function markAllNotificationsRead(notificationIds: string[]): string[] {
  const nextIds = Array.from(new Set([...getReadNotificationIds(), ...notificationIds]));
  writeStorage(readIdsKey, nextIds);
  return nextIds;
}