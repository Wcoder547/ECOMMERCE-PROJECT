import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

type cartItemProps = {
  cartItem: any;
};

const CartItem = ({ cartItem }: cartItemProps) => {
  const { photo, name, ProductId, quantity, price } = cartItem;
  return (
    <div className="cart-item">
      <img src={photo} alt="" />

      <article>
        <Link to={`/product/${ProductId}`}>{name}</Link>
        <span>${price}</span>
      </article>
      <div>
        <button>-</button>
        <p>{quantity}</p>
        <button>+</button>
      </div>
      <button>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
