"use client";

import { api } from "@/trpc/react";
import { toast } from "sonner";

export default function AddToCart({ productId }: { productId: number }) {

  const utils = api.useUtils();
  const addToCart = api.cart.addToCart.useMutation({
    onSuccess: async () => {
      await utils.cart.getCart.invalidate();
    }
  });


  return (
    <button
      className="mt-6 px-8 py-2 text-lg font-bold text-white bg-blue-800 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      onClick={() => {
        toast.promise(addToCart.mutateAsync({ productId }), {
          loading: "Adding to cart...",
          success: "Added to cart",
          error: "Failed to add to cart",
        })
      }}
      disabled={addToCart.isPending}
    >
      Add To Cart
    </button>
  );
}
