export type Credentials = {
  email: string;
  password: string;
};
export interface Tenant {
  id: number;
  name: string;
  address: string;
}

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  tenant: Tenant | null;
};
export type CreateUserData = {
  id: string;
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
