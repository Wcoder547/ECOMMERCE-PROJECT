import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { resetCart } from "../redux/reducer/cartReducer";
import { responseToast } from "../utils/features";
import { NewOrderRequest } from "../types/api-types";
import { RootState } from "../redux/store";

// ✅ Load Stripe with env key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);
  const { shippingInfo, cartItems, subtotal, tax, discount, shippingCharges, total } =
    useSelector((state: RootState) => state.cartReducer);

  const [isProcessing, setIsProcessing] = useState(false);
  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderitems: cartItems, // ✅ match backend field
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user?._id || "",
    };

    

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Payment failed");
    }

    if (paymentIntent?.status === "succeeded") {
      toast.success("Payment successful!");
      try {
        const res = await newOrder(orderData);

        if ("data" in res) {
      
          dispatch(resetCart());
          responseToast(res, navigate, "/orders");
        } else {
          responseToast(res, null, "");
        }
      } catch (err) {
        toast.error("❌ Something went wrong while placing order");
        console.error(err);
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

const CheckOut = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to="/shipping" />;

  return (
    <Elements key={clientSecret} options={{ clientSecret }} stripe={stripePromise}>
      <CheckOutForm />
    </Elements>
  );
};

export default CheckOut;
