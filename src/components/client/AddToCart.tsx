"use client";

import { api } from "@/trpc/react";
import { toast } from "sonner";

export default function AddToCart({ productId }: { productId: number }) {

  const utils = api.useUtils();
  const addToCart = api.post.addToCart.useMutation({
    onSuccess: async () => {
      toast.success("Added to cart");
      await utils.post.getCart.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });


  return (
    <button
      className="mt-6 px-8 py-2 text-lg font-bold text-white bg-blue-800 rounded-lg"
      onClick={() => {
        toast.promise(addToCart.mutateAsync({ productId }), {
          loading: "Adding to cart...",
          success: "Added to cart",
          error: "Failed to add to cart",
        })
      }}
    >
      Add To Cart
    </button>
  );
}
