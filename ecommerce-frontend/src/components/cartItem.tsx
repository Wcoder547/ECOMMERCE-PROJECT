import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { cartItem } from "../types/types";

type cartItemProps = {
  cartItem: cartItem;
  incrementHandler: (cartItem: cartItem) => void;
  decrementHandler: (cartItem: cartItem) => void;
  removeHandler: (id: string) => void;
};

const CartItem = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: cartItemProps) => {
  const { photo, name, productId, quantity, price } = cartItem;
  return (
    <div className="cart-item">
      <img src={`${server}/${photo}`} alt="" />

      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>${price}</span>
      </article>
      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>
      <button onClick={() => removeHandler(productId)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
