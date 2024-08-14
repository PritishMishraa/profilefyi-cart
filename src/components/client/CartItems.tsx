"use client";

import { api } from "@/trpc/react";
import { type Cart } from "@prisma/client";
import Image from "next/image";
import { toast } from "sonner";

export default function CartItems({ initalCart }: { initalCart: Cart[] }) {

    const products = api.post.getCart.useQuery(undefined, {
        initialData: initalCart,
        refetchOnWindowFocus: "always"
    });

    const utils = api.useUtils();
    const clearCart = api.post.clearCart.useMutation({
        onSuccess: async () => {
            await utils.post.getCart.invalidate();
        }
    });

    const removeFromCart = api.post.removeFromCart.useMutation({
        onSuccess: async () => {
            await utils.post.getCart.invalidate();
        }
    });

    const updateQuantity = api.post.updateQuantity.useMutation({
        onSuccess: async () => {
            await utils.post.getCart.invalidate();
        }
    });

    return (
        <div className="h-full flex flex-col p-8 w-full">
            <h2 className="mb-4 text-2xl font-bold leading-10 text-gray-800">
                Your Cart
            </h2>
            {products.data.length === 0 && (
                <p className="mb-4 grow text-lg leading-7 text-gray-600">
                    You have 0 items in your cart.
                </p>
            )}
            {products.data.map((product) => (
                <div key={product.productId} className="flex flex-col md:flex-row grow items-start justify-between border-b py-4">
                    <div className="flex items-center">
                        <Image src={product.image} alt={product.name} width={80} height={80} className="mr-4" />
                        <div>
                            <h3 className="font-bold text-black">{product.name}</h3>
                            <p className="text-gray-600">
                                {product.price.toLocaleString("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => toast.promise(updateQuantity.mutateAsync({ productId: product.productId, quantity: product.quantity - 1 }), {
                                loading: "Reducing quantity",
                                success: "Reduced quantity",
                                error: "Failed to reduce quantity",
                            })}
                            className="px-2 py-1 bg-gray-200 text-black rounded"
                            disabled={product.quantity === 1}
                        >
                            -
                        </button>
                        <span className="mx-2 text-black">{product.quantity}</span>
                        <button
                            onClick={() => toast.promise(updateQuantity.mutateAsync({ productId: product.productId, quantity: product.quantity + 1 }), {
                                loading: "Increasing quantity",
                                success: "Increased quantity",
                                error: "Failed to increase quantity",
                            })}
                            className="px-2 py-1 bg-gray-200 text-black rounded"
                        >
                            +
                        </button>
                        <button
                            onClick={() => toast.promise(removeFromCart.mutateAsync({ productId: product.productId }), {
                                loading: "Removing from cart",
                                success: "Removed from cart",
                                error: "Failed to remove from cart",
                            })}
                            className="ml-4 text-red-600"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <div className="flex justify-between w-full pb-8">
                <button
                    className="mt-6 px-4 py-2 text-lg font-bold text-white bg-green-800 rounded-lg"
                    onClick={() => {
                        toast.promise(clearCart.mutateAsync(), {
                            loading: "Clearing cart",
                            success: "Cart cleared",
                            error: "Failed to clear cart",
                        });
                    }
                    }
                >
                    Clear Cart
                </button>
                <button className="mt-6 px-4 py-2 text-lg font-bold text-white bg-blue-800 rounded-lg">
                    Checkout
                </button>
            </div>
        </div>
    );
}
