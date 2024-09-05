import { useState, useEffect } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cartItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartReducerInitialState } from "../types/reducer-types";
import { cartItem } from "../types/types";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeToCart,
} from "../redux/reducer/cartReducer";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
  const { cartItems, total, subtotal, tax, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
    );
  const [couponCode, setcouponCode] = useState<string>("");
  const [isValidCouponCode, setisValidCouponCode] = useState<boolean>(false);

  const dispatch = useDispatch();
  const incrementHandler = (cartItem: cartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: cartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeToCart(productId));
  };
  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();
    const timeOutId = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          console.log(res.data);
          setisValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setisValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
      cancel();
      setisValidCouponCode(false);
    };
  }, [couponCode]);
  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <>
      <div className="cart">
        <main>
          {cartItems.length > 0 ? (
            cartItems.map((i, indx) => (
              <CartItem
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
                key={indx}
                cartItem={i}
              />
            ))
          ) : (
            <h1>No items Found</h1>
          )}
        </main>
        <aside>
          <p>SubTotal : ${subtotal}</p>
          <p>Shipping Charges: ${shippingCharges}</p>
          <p>Tax :${tax}</p>
          <p>
            Discount :-
            <em className="red">${discount}</em>
          </p>
          <b>Total : ${total}</b>
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setcouponCode(e.target.value)}
          />
          {couponCode &&
            (isValidCouponCode ? (
              <span className="green">
                ${discount} off Using
                <code className="text-coupon">{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                invalid coupon <VscError />
              </span>
            ))}
          {cartItems.length > 0 && <Link to={"/Shipping"}>CheckOut</Link>}
        </aside>
      </div>
    </>
  );
};

export default Cart;
