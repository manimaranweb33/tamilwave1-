import type { AuditAction, Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export async function logAudit(params: {
  actorId?: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  try {
    await db.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata
      }
    });
  } catch {
    // non-blocking
  }
}
