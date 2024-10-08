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

export type ProductAttributes = {
  name: string;
  value: string | boolean;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  category: Category;
  isPublish: boolean;
  createdAt: string;
  image: string;
  priceConfiguration: PriceConfiguration;
  attributes: ProductAttributes[];
};
export type ImageFiled = { file: File };
export type CreateProductData = Product & {
  image: ImageFiled;
};

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional";
    availableOptions: string[];
  };
}

export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}

export interface Category {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}
