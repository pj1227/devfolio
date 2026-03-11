import { useFetch } from '@devfolio/shared-hooks';

export type Resume = 'fullstack' | 'dotnet';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';

export function useResumeApi<T>(endpoint: string, resume?: Resume) {
  const url = resume
    ? `${API_BASE}${endpoint}?resume=${resume}`
    : `${API_BASE}${endpoint}`;
  return useFetch<T>(url);
}