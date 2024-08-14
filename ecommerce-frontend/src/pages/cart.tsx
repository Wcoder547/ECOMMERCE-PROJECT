import { useState, useEffect } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cartItem";
import { Link } from "react-router-dom";

const cartItems = [
  {
    ProductId: "ahsdfjlksdjflk",
    photo: "https://m.media-amazon.com/images/I/61HUaSA6c0L._AC_UY218_.jpg",
    name: "Macbook",
    price: 555,
    quantity: 4,
    stock: 10,
  },
  {
    ProductId: "ahsdfjlksdjflk",
    photo: "https://m.media-amazon.com/images/I/61HUaSA6c0L._AC_UY218_.jpg",
    name: "Macbook",
    price: 555,
    quantity: 4,
    stock: 10,
  },
  {
    ProductId: "ahsdfjlksdjflk",
    photo: "https://m.media-amazon.com/images/I/61HUaSA6c0L._AC_UY218_.jpg",
    name: "Macbook",
    price: 555,
    quantity: 4,
    stock: 10,
  },
  {
    ProductId: "ahsdfjlksdjflk",
    photo: "https://m.media-amazon.com/images/I/61HUaSA6c0L._AC_UY218_.jpg",
    name: "Macbook",
    price: 555,
    quantity: 4,
    stock: 10,
  },
  {
    ProductId: "ahsdfjlksdjflk",
    photo: "https://m.media-amazon.com/images/I/61HUaSA6c0L._AC_UY218_.jpg",
    name: "Macbook",
    price: 555,
    quantity: 4,
    stock: 10,
  },
];
const subTotoal = 4000;
const tax = Math.round(subTotoal * 0.18);
const shippingCharges = 200;
const discount = 400;
const total = subTotoal + tax + shippingCharges;
const coupon = 555;
const Cart = () => {
  const [couponCode, setcouponCode] = useState<string>("");
  const [isValidCouponCode, setisValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (coupon === 555) setisValidCouponCode(true);
      else setisValidCouponCode(false);
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
      setisValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <>
      <div className="cart">
        <main>
          {cartItems.length > 0 ? (
            cartItems.map((i, indx) => <CartItem key={indx} cartItem={i} />)
          ) : (
            <h1>No items Found</h1>
          )}
        </main>
        <aside>
          <p>SubTotal : ${subTotoal}</p>
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
