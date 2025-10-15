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

export enum PaymentMode {
  CARD = "card",
  CASH = "cash",
}

export enum OrderStatus {
  RECEIVED = "received",
  CONFRIMED = "confrimed",
  PREPARED = "prepared",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export type Topping = {
  _id: string;
  name: string;
  image: string;
  price: number;
};
export interface CartItems
  extends Pick<Product, "_id" | "name" | "image" | "priceConfiguration"> {
  chosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
  qty: number;
  hash?: string;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Order {
  _id: string;
  image: any;
  cart: CartItems[];
  customerId: Customer;
  customer?: Customer;
  totalAmount: number;
  discount: number;
  taxes: number;
  deliveryCharges: number;
  address: string;
  tenantId: string;
  comment?: string;
  paymentMode: PaymentMode;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string;
}
