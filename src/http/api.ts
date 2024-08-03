import { Tenant } from "../store";
import { CreateUserData, Credentials } from "../types";
import { api } from "./client";

// Auth Service
export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");

export const getUsers = (queryString: string) =>
  api.get(`/users?${queryString}`);
export const createUser = (user: CreateUserData) => api.post("/users", user);
export const updateUser = (user: CreateUserData, id: string) =>
  api.patch(`/users/${id}`, user);

export const getRestaurants = (queryString: string) =>
  api.get(`/tenants?${queryString}`);
export const createTenant = (tenant: Tenant) => api.post("/tenants", tenant);
export const updateTenant = (tenant: Tenant, id: number) =>
  api.patch(`/tenants/${id}`, tenant);
