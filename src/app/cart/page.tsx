import CartItems from "@/components/client/CartItems";
import { api, HydrateClient } from "@/trpc/server";

export default async function Cart() {
  const cart = await api.post.getCart();

  return (
    <HydrateClient>
      <div className="flex flex-wrap gap-2">
        <ul role="list" className="flex flex-row flex-wrap m-2 w-full">
          <CartItems initalCart={cart} />
        </ul>
      </div>
    </HydrateClient>
  );
}
