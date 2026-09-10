import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

const API_BASE = import.meta.env.VITE_API_URL as string;

export interface UserJob {
  id: string;
  title: string;
  company: string;
  location: string;
  site: string;
  job_type: string;
  is_remote: boolean;
  salary: {
    min_amount: number | null;
    max_amount: number | null;
    currency: string;
    interval: string;
  };
  date_posted: string;
  job_url: string;
  job_url_direct: string;
  description: string;
  skills: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  jobs: UserJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobFilterParams {
  search?: string;
  location?: string;
  site?: string;
  job_type?: string;
  is_remote?: boolean | string;
  page?: number;
  limit?: number;
}

export const useJobs = (filters: JobFilterParams = {}) => {
  const query = new URLSearchParams();
  if (filters.search) query.append("search", filters.search);
  if (filters.location) query.append("location", filters.location);
  if (filters.site && filters.site !== "all") query.append("site", filters.site);
  if (filters.job_type && filters.job_type !== "all") query.append("job_type", filters.job_type);
  if (filters.is_remote !== undefined && filters.is_remote !== "all" && filters.is_remote !== "") {
    query.append("is_remote", String(filters.is_remote));
  }
  if (filters.page) query.append("page", String(filters.page));
  if (filters.limit) query.append("limit", String(filters.limit));

  const queryString = query.toString();
  const url = `${API_BASE}/jobs${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => apiFetch<JobsResponse>(url),
    staleTime: 60_000,
  });
};
