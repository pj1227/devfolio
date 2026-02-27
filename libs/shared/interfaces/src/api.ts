/**
 * @file api.ts
 * @description API response envelope types.
 *
 * Every endpoint wraps its payload in ApiResponse<T>.
 * The meta.stack field is how the frontend knows which
 * backend/database combination actually responded —
 * and meta.durationMs enables live performance comparison
 * between stacks on the /stack page.
 */

export interface StackIdentifier {
  frontend?: string;   // "Next.js 15.1"
  backend: string;     // "FastAPI 0.115.4"
  database: string;    // "PostgreSQL 17.2"
}

export interface ApiMeta {
  timestamp: string;   // ISO 8601
  stack: StackIdentifier;
  durationMs: number;  // total response time — shown in the Stack Selector UI
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}
