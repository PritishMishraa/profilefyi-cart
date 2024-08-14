import ProductCard from "@/components/server/ProductCard";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const products = await api.post.getProducts();

  return (
    <HydrateClient>
      <div className="flex flex-wrap gap-2">
        <ul role="list" className="flex flex-row flex-wrap m-2">
          {products.map((product) => (
            <li key={product.id} className="md:w-1/3">
              <ProductCard {...product} />
            </li>
          ))}
        </ul>
      </div>
    </HydrateClient>
  );
}
