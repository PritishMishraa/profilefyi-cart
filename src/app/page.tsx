import Link from "next/link";

import { api, HydrateClient } from "@/trpc/server";
import ProductCard from "./components/ProductCard";

export default async function Home() {
  const products = await api.post.getProducts();

  return (
    <HydrateClient>
      <div className="flex flex-wrap gap-2">
        <ul role="list" className="flex flex-row flex-wrap m-2">
          {products.map((product) => (
            <li key={product.id} className="md:w-1/3">
              <Link href={`/products/${product.id}`}>
                <ProductCard {...product} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </HydrateClient>
  );
}
