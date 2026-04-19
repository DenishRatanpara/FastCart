export interface IGrocery {
  _id: any;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity?: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  _id: any;
  user: any;
  items: {
    grocery: any;
    name: string;
    price: number;
    unit: string;
    image: string;
    quantity: number;
  }[];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: number;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  status: "pending" | "out_for_delivery" | "delivered";
  assignment: any;
  assignedDeliveryBoy: any;
  deliveryOtp?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id: any;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}
