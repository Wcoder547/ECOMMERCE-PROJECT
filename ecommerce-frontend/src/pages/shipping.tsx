import { BiArrowBack } from "react-icons/bi";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const navigate = useNavigate();
  const [shippingInfo, setshippingInfo] = useState({
    address: "",
    city: "",
    province: "",
    countery: "",
    pincode: "",
  });
  const chnageHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setshippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form>
        <h1>Shipping Address</h1>
        <input
          type="text"
          name="address"
          placeholder="Adress"
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
          name="countery"
          required
          value={shippingInfo.countery}
          onChange={chnageHandler}>
          <option value="">Please select Your Countery</option>
          <option value="pakistan">Pakistan</option>
        </select>
        <input
          type="number"
          name="pincode"
          placeholder="PinCode"
          value={shippingInfo.pincode}
          onChange={chnageHandler}
          required
        />
        <button type="submit">Pay now</button>
      </form>
    </div>
  );
};

export default Shipping;
