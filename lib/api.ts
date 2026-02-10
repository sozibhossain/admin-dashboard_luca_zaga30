import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL =
  process.env.NEXTPUBLICBASEURL ||
  process.env.NEXT_PUBLIC_BASEURL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  "";

export const apiClient = axios.create({
  baseURL,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

apiClient.interceptors.request.use(async (config) => {
  let token = accessToken;
  if (!token && typeof window !== "undefined") {
    const session = await getSession();
    token = session?.accessToken ?? null;
  }
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AuthUser = {
  _id: string;
  name?: string;
  email: string;
  role: string;
  avatar?: {
    url?: string;
  };
  verificationInfo?: {
    verified: boolean;
  };
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  role: string;
  _id: string;
  user: AuthUser;
};

export type AdminUser = {
  _id: string;
  name?: string;
  email: string;
  role: string;
  verificationInfo?: {
    verified: boolean;
  };
  createdAt?: string;
};

export type Property = {
  _id: string;
  name: string;
  address: {
    city: string;
    country: string;
  };
  propertyType: string;
  status: string;
  purchasePrice: number;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
  createdAt?: string;
};

export type Payment = {
  _id: string;
  amount: number;
  status: string;
  type: string;
  dueDate: string;
  paidDate?: string;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
  property?: {
    name?: string;
    address?: {
      city?: string;
      country?: string;
    };
  };
};

export type DashboardAnalytics = {
  range: {
    from: string;
    to: string;
  };
  totals: {
    users: number;
    properties: number;
    payments: number;
  };
  newInRange: {
    users: number;
    properties: number;
    payments: number;
  };
  paymentsByStatus: Record<string, number>;
  propertiesByStatus: Record<string, number>;
  amounts: {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
  };
  monthlyRevenue: Array<{
    year: number;
    month: number;
    total: number;
    count: number;
  }>;
};

export type CountrySummary = {
  country: string;
  count: number;
  totalPurchaseValue: number;
  totalMortgageAmount: number;
  avgPurchasePrice: number;
  totalMonthlyRent: number;
};

export const login = async (payload: { email: string; password: string }) => {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    payload,
  );
  return data;
};

export const forgotPassword = async (payload: { email: string }) => {
  const { data } = await apiClient.post<ApiResponse<Record<string, never>>>(
    "/auth/forget",
    payload,
  );
  return data;
};

export const verifyOtp = async (payload: { email: string; otp: string }) => {
  const { data } = await apiClient.post<ApiResponse<Record<string, never>>>(
    "/auth/verify",
    payload,
  );
  return data;
};

export const resetPassword = async (payload: {
  email: string;
  password: string;
  otp?: string;
}) => {
  const { data } = await apiClient.post<ApiResponse<Record<string, never>>>(
    "/auth/reset-password",
    payload,
  );
  return data;
};

export const changePassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}) => {
  const { data } = await apiClient.post<ApiResponse<string>>(
    "/auth/change-password",
    payload,
  );
  return data;
};

export const refreshToken = async (payload: { refreshToken: string }) => {
  const { data } = await apiClient.post<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  >("/auth/refresh-token", payload);
  return data;
};

export const getAdminDashboardAnalytics = async (params?: {
  from?: string;
  to?: string;
}) => {
  const { data } = await apiClient.get<ApiResponse<DashboardAnalytics>>(
    "/admin/dashboard",
    { params },
  );
  return data;
};

export const getAdminUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  verified?: string;
  sort?: string;
}) => {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminUser>>>(
    "/admin/users",
    { params },
  );
  return data;
};

export const getAdminPayments = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  userId?: string;
  propertyId?: string;
  from?: string;
  to?: string;
  sort?: string;
}) => {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Payment>>>(
    "/admin/payments",
    { params },
  );
  return data;
};

export const getAdminProperties = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  propertyType?: string;
  status?: string;
  country?: string;
  userId?: string;
  sort?: string;
}) => {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Property>>>(
    "/admin/properties",
    { params },
  );
  return data;
};

export const getPropertiesByCountry = async (params?: {
  userId?: string;
  from?: string;
  to?: string;
}) => {
  const { data } = await apiClient.get<ApiResponse<CountrySummary[]>>(
    "/admin/properties/by-country",
    { params },
  );
  return data;
};
