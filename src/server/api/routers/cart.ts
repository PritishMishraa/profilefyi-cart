import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type Cart } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  getCart: publicProcedure.query(async ({ ctx }) => {
    const cart = await ctx.db.cart.findMany()
    const sortedCart = cart.sort((a, b) => a.productId - b.productId);
    return sortedCart ?? [] as Cart[];
  }),

  getProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany();

    return products ?? [];
  }),

  getProduct: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
      });

      return product ?? null;
    }),

  addToCart: publicProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const productInCart = await ctx.db.cart.findUnique({
        where: { productId: input.productId },
      });

      if (productInCart !== null) {
        const product = await ctx.db.product.findUnique({
          where: { id: input.productId },
        });
        if (product) {
          return ctx.db.cart.update({
            where: { productId: input.productId },
            data: { quantity: productInCart.quantity + 1 },
          });
        }
      } else {
        const product = await ctx.db.product.findUnique({
          where: { id: input.productId },
        });
        if (product) {
          return ctx.db.cart.create({
            data: {
              productId: input.productId,
              image: product.image,
              name: product.name,
              price: product.price,
              quantity: 1,
            },
          });
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Product not found",
          });
        }
      }
    }),

  removeFromCart: publicProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const productInCart = await ctx.db.cart.findUnique({
        where: { productId: input.productId },
      });

      if (productInCart !== null) {
        return ctx.db.cart.delete({
          where: { productId: input.productId },
        });
      }
    }),

  updateQuantity: publicProcedure
    .input(z.object({ productId: z.number(), quantity: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (input.quantity < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Quantity must be greater than 0",
        });
      }
      const productInCart = await ctx.db.cart.findUnique({
        where: { productId: input.productId },
      });

      if (productInCart !== null) {
        return ctx.db.cart.update({
          where: { productId: input.productId },
          data: { quantity: input.quantity },
        });
      }
    }),

  clearCart: publicProcedure.mutation(async ({ ctx }) => {
    const cart = await ctx.db.cart.findMany();

    if (cart.length > 0) {
      return ctx.db.cart.deleteMany();
    }
  }),
});
