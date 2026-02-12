import { BiArrowBack } from "react-icons/bi";
import { ChangeEvent, useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { cartReducerInitialState } from "../types/reducer-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShoppingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector(
    (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
  );
  // Calculate total from cartItems
  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShoppingInfo(shippingInfo));
    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("something went wrong!!");
    }
  };

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    province: "",     // Using province
    country: "",
    pinCode: "",
  });

  const chnageHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  }, [cartItems, navigate]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={chnageHandler}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingInfo.city}
          onChange={chnageHandler}
          required
        />
        <input
          type="text"
          name="province"
          placeholder="Province"
          value={shippingInfo.province}
          onChange={chnageHandler}
          required
        />

        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={chnageHandler}>
          <option value="">Please select Your Country</option>
          <option value="pakistan">Pakistan</option>
        </select>
        <input
          type="number"
          name="pinCode"
          placeholder="Pin Code"
          value={shippingInfo.pinCode}
          onChange={chnageHandler}
          required
        />
        <button type="submit">Pay now</button>
      </form>
    </div>
  );
};

export default Shipping;
