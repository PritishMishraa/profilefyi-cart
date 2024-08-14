import Image from "next/image";
import Link from "next/link";
import AddToCart from "../client/AddToCart";

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  small,
}: {
  id: number;
  name?: string;
  image?: string | null;
  description?: string;
  price?: number;
  small?: boolean;
}) => (
  <div className="p-2 flex flex-col">
    <Link href={`/products/${id}`}>
      <Image
        className={`aspect-[2/2] rounded-md object-cover border-2 border-gray-800`}
        src={image ?? ""}
        alt={`${name} image`}
        width={1024}
        height={1024}
      />
      <div>
        {name && (
          <h3
            className={`mt-2 font-bold leading-10 text-gray-800 ${small ? "" : "text-xl"
              }`}
          >
            {name}
          </h3>
        )}
        {!small && price && (
          <div className="my-1 text-md leading-5 text-gray-600">
            {price.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </div>
        )}
        {!small && description && (
          <div className="mt-1 text-sm leading-5 text-gray-600 font-light italic">
            {description}
          </div>
        )}
      </div>
    </Link>
    <AddToCart productId={id} />
  </div>
);

export default ProductCard;
