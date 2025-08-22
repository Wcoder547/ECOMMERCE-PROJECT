import { FaPlus } from "react-icons/fa6";
import { cartItem } from "../types/types";
import { Link } from "react-router-dom";
import { FaExpandAlt } from "react-icons/fa";
import { transformImage } from "../utils/features";

type productProps = {
  productId: string;
 photos: {
    url: string;
    public_id: string;
  }[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: cartItem) => string | undefined;
};

function ProductCard({
  productId,
  photos,
  name,
  price,
  stock,
  handler,
}: productProps) {
  return (

    <div className="ProductCard" key={productId}>
      <img src={transformImage(photos?.[0]?.url, 400)} alt="this is it" />
      <p>{name}</p>
      <span>${price}</span>
      <div>
        <button
          onClick={() =>
            handler({ productId,  photo: photos[0].url, name, price, stock, quantity: 1 })
          }>
          <FaPlus />
        </button>

        <Link to={`/product/${productId}`}>
          <FaExpandAlt />
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
