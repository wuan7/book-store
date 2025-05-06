import { Prisma, Review } from "../lib/generated/prisma";

export type CartWithCartItemsAndProducts = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: {
        product: true;
      };
    };
  };
}>;

export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: true;
  };
}>;

export type OrderWithOrderItemsAndProduct = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: true;
      };
    };
  };
}>;

export type OrderItemWithProduct = Prisma.OrderItemGetPayload<{
  include: {
    product: true;
  };
}>;
export type ProductWithExtra = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  averageRating: number;
  totalSold: number;
  discount: number;
  slug: string;
  author: string;
  reserved: number;
  reviews: Review[];
};

export type ArticleWithPostCateGory = Prisma.ArticleGetPayload<{
  include: {
    postCategory: true;
  };
}>;

export type OrderWithOrderItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: true;
  };
}>;

export type UserWithAccount = Prisma.UserGetPayload<{
    include: { accounts: true };
  }>;
