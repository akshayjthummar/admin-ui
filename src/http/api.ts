import { Tenant } from "../store";
import { CreateUserData, Credentials } from "../types";
import { api } from "./client";

const AUTH_SERVICE = "api/auth";
const CATALOG_SERVICE = "api/catalog";

// Auth Service
export const login = (credentials: Credentials) =>
  api.post(`/${AUTH_SERVICE}` + "/auth/login", credentials);

export const self = () => api.get(`/${AUTH_SERVICE}` + "/auth/self");

export const logout = () => api.post(`/${AUTH_SERVICE}` + "/auth/logout");

export const getUsers = (queryString: string) =>
  api.get(`/${AUTH_SERVICE}` + `/users?${queryString}`);
export const createUser = (user: CreateUserData) =>
  api.post(`/${AUTH_SERVICE}` + "/users", user);
export const updateUser = (user: CreateUserData, id: string) =>
  api.patch(`/${AUTH_SERVICE}` + `/users/${id}`, user);

export const getRestaurants = (queryString: string) =>
  api.get(`/${AUTH_SERVICE}` + `/tenants?${queryString}`);
export const createTenant = (tenant: Tenant) =>
  api.post(`/${AUTH_SERVICE}` + "/tenants", tenant);
export const updateTenant = (tenant: Tenant, id: number) =>
  api.patch(`/${AUTH_SERVICE}` + `/tenants/${id}`, tenant);

export const getCategories = () => api.get(`/${CATALOG_SERVICE}/categories`);
export const getProducts = (queryString: string) =>
  api.get(`/${CATALOG_SERVICE}/products?${queryString}`);
