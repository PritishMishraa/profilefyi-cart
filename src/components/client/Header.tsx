"use client";

import { api } from "@/trpc/react";
import { type Cart } from "@prisma/client";
import Link from "next/link";

export default function Header({ initalCart }: { initalCart: Cart[] }) {

  const cart = api.post.getCart.useQuery(undefined, {
    initialData: initalCart,
    refetchOnWindowFocus: "always"
  });


  return (
    <header className="sticky top-0 mx-2 flex items-center justify-between p-4 bg-blue-800 mb-10 rounded-b-2xl">
      <Link href="/">
        <h1 className="text-3xl font-bold leading-10 text-gray-100">
          Dragoons Store
        </h1>
      </Link>
      <Link href="/cart" className="flex items-center justify-center w-10 h-10 bg-blue-700 rounded-full">
        <span className="text-xl font-bold leading-10 text-gray-100">
          {cart.data?.length}
        </span>
      </Link>
    </header>
  );
}
