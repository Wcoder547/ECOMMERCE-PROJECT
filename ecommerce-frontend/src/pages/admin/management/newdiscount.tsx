import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { RootState } from "../../../redux/store";
import { useNewCouponMutation } from "../../../redux/api/paymentApi";

const NewDiscount = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);

  const [createCoupon] = useNewCouponMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const res = await createCoupon({
        id: user?._id,
        body: { code, amount },
      }).unwrap();

      if (res.success) {
        setAmount(0);
        setCode("");
        toast.success(res.message);
        navigate("/admin/discount");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create coupon");
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Coupon</h2>

            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Coupon Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>

            <button disabled={btnLoading} type="submit">
              {btnLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewDiscount;
