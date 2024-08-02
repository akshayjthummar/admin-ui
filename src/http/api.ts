import { Tenant } from "../store";
import { CreateUserData, Credentials } from "../types";
import { api } from "./client";

// Auth Service
export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");

export const getUsers = () => api.get("/users");
export const getRestaurants = () => api.get("/tenants");
export const createTenant = (tenant: Tenant) => api.post("/tenants", tenant);
export const createUser = (user: CreateUserData) => api.post("/users", user);
