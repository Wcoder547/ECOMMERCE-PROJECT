import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewCouponMutation } from "../../../redux/api/paymentApi"; // adjust path
import { toast } from "react-hot-toast";


const Coupon = () => {

 const [coupon, setCoupon] = useState("");
const [amount, setAmount] = useState(""); // keep as string
const [generatedCoupon, setGeneratedCoupon] = useState("");
const [isCopied, setIsCopied] = useState(false);
const [newCouponMutation, { isLoading }] = useNewCouponMutation();

const handleCopy = () => {
  if (!generatedCoupon) return;
  navigator.clipboard.writeText(generatedCoupon);
  toast.success("Coupon copied!");
};

const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  //  console.log(coupon,amount)
  if (!coupon || !amount) {
    console.log(coupon,amount)
    toast.error("Please fill all fields");
    return;
  }

  try {
    const res = await newCouponMutation({
      coupon,
      amount: Number(amount), 
    }).unwrap();
    console.log(res.message); //

    toast.success(res.message || "Coupon generated successfully!");
    setGeneratedCoupon(coupon);
    setCoupon("");
    setAmount("");
  } catch (error: any) {
    console.log(error?.data?.message)
    toast.error(error?.data?.message || "Failed to generate coupon");
  }
};


  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Coupon</h1>
        <section>
          <form className="coupon-form" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
        
            />

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
              max={2500}
            />
            <button type="submit">Generate</button>
          </form>

            {generatedCoupon && (
            <code>
              {generatedCoupon} 
              <span onClick={handleCopy}>
                {isCopied ? "Copied" : "Copy"}
              </span>
            </code>
          )}
        </section>
      </main>
    </div>
  );
};

export default Coupon;
