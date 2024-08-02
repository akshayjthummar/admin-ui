export type Credentials = {
  email: string;
  password: string;
};
export interface Tenant {
  id: number;
  name: string;
  address: string;
}
export interface User {
  id: number;
  firstName: number;
  lastName: number;
  email: string;
  createdAt: string;
}

export type CreateUserData = {
  id: number;
  firstName: number;
  lastName: number;
  email: string;
  createdAt: string;
  role: string;
  tenantId: number;
};

export type FieldData = {
  name: string[];
  value?: string;
};
