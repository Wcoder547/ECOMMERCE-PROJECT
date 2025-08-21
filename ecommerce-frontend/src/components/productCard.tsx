import { FaPlus } from "react-icons/fa6";
import { cartItem } from "../types/types";
import { Link } from "react-router-dom";
import { FaExpandAlt } from "react-icons/fa";

type productProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: cartItem) => string | undefined;
};

function ProductCard({
  productId,
  photo,
  name,
  price,
  stock,
  handler,
}: productProps) {
  return (
    // uploads/Screenshot from 2024-08-14 17-24-35.png
    <div className="ProductCard" key={productId}>
      <img src={`${photo}`} alt="" />
      <p>{name}</p>
      <span>${price}</span>
      <div>
        <button
          onClick={() =>
            handler({ productId, photo, name, price, stock, quantity: 1 })
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
