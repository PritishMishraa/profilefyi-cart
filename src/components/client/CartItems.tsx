"use client";

import { api } from "@/trpc/react";
import { type Cart } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function CartItems({ initalCart }: { initalCart: Cart[] }) {
    const [discount, setDiscount] = useState<number | null>(null);

    const products = api.cart.getCart.useQuery(undefined, {
        initialData: initalCart,
        refetchOnWindowFocus: "always",
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    const utils = api.useUtils();
    const clearCart = api.cart.clearCart.useMutation({
        onSuccess: async () => {
            await utils.cart.getCart.invalidate();
        }
    });

    const removeFromCart = api.cart.removeFromCart.useMutation({
        onSuccess: async () => {
            await utils.cart.getCart.invalidate();
        }
    });

    const updateQuantity = api.cart.updateQuantity.useMutation({
        onMutate: async (newQunatity) => {
            await utils.cart.getCart.cancel();

            const prevData = utils.cart.getCart.getData();

            utils.cart.getCart.setData(undefined, (old) => {
                if (!old) return;

                const newData = old.map((product) => {
                    if (product.productId === newQunatity.productId) {
                        return {
                            ...product,
                            quantity: newQunatity.quantity,
                        };
                    }

                    return product;
                });

                return newData;
            });

            return prevData;
        },
        onSuccess: async () => {
            await utils.cart.getCart.invalidate();
        },
        onError: async (_err, _newcart, ctx) => {
            utils.cart.getCart.setData(undefined, ctx);
        },
        onSettled: async () => {
            await utils.cart.getCart.invalidate();
        }
    });

    const calculateSubtotal = () => {
        return products.data.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        if (!discount) return subtotal;

        const isPercentageDiscount = discount < 1;
        return isPercentageDiscount ? subtotal * (1 - discount) : subtotal - discount;
    };

    const applyDiscount = (type: "fixed" | "percentage", value: number) => {
        setDiscount(type === "percentage" ? value / 100 : value);
    };

    return (
        <div className="h-full flex flex-col p-8 w-full">
            {products.data.length === 0 && (
                <p className="mb-4 grow text-lg leading-7 text-gray-600">
                    You have 0 items in your cart.
                </p>
            )}
            {products.data.map((product) => (
                <div key={product.productId} className="flex flex-col md:flex-row grow items-center justify-between border-b py-4 gap-2 md:gap-0">
                    <div className="flex items-center w-full">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="mr-4"
                        />
                        <div>
                            <h3 className="font-bold text-black">{product.name}</h3>
                            <div className="flex items-center gap-2">
                                <p className="text-gray-600 text-xs">
                                    {product.price.toLocaleString("en-IN", {
                                        style: "currency",
                                        currency: "INR",
                                    })} x {product.quantity}
                                </p> :
                                <p className="text-gray-600 text-xs font-bold">
                                    {(product.price * product.quantity).toLocaleString("en-IN", {
                                        style: "currency",
                                        currency: "INR",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end w-full">
                        <button
                            onClick={() => toast.promise(updateQuantity.mutateAsync({
                                productId: product.productId,
                                quantity: product.quantity - 1
                            }), {
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
                            onClick={() => toast.promise(updateQuantity.mutateAsync({
                                productId: product.productId,
                                quantity: product.quantity + 1
                            }), {
                                loading: "Increasing quantity",
                                success: "Increased quantity",
                                error: "Failed to increase quantity",
                            })}
                            className="px-2 py-1 bg-gray-200 text-black rounded"
                        >
                            +
                        </button>
                        <button
                            onClick={() => toast.promise(removeFromCart.mutateAsync({
                                productId: product.productId
                            }), {
                                loading: "Removing from cart",
                                success: "Removed from cart",
                                error: "Failed to remove from cart",
                            })}
                            className="ml-4 text-red-600 hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            {products.data.length > 0 && (
                <>
                    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-800">Cart Summary</h3>
                        <p className="text-lg text-gray-700">
                            Subtotal:{" "}
                            {calculateSubtotal().toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                            })}
                        </p>
                        <p className="text-lg text-gray-700">
                            Discount:{" "}
                            {discount
                                ? (discount < 1 ? `${discount * 100}%` : discount.toLocaleString("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                }))
                                : "No discount applied"}
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                            Total:{" "}
                            {calculateTotal().toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                            })}
                        </p>
                        <div className="mt-4 flex gap-4">
                            <button
                                className="px-4 py-2 bg-blue-800 text-white rounded-lg"
                                onClick={() => applyDiscount("fixed", 500)}
                            >
                                Apply ₹500 Discount
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-800 text-white rounded-lg"
                                onClick={() => applyDiscount("percentage", 10)}
                            >
                                Apply 10% Discount
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="flex justify-between w-full pb-8">
                <button
                    className="mt-6 px-4 py-2 text-lg font-bold text-white bg-red-500 rounded-lg"
                    onClick={() => {
                        toast.promise(clearCart.mutateAsync(), {
                            loading: "Clearing cart",
                            success: "Cart cleared",
                            error: "Failed to clear cart",
                        })
                    }
                    }
                >
                    Clear Cart
                </button>
                <button className="mt-6 px-4 py-2 text-lg font-bold text-white bg-green-600 rounded-lg">
                    Checkout
                </button>
            </div>
        </div>
    );
}
