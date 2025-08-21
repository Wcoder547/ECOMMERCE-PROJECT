import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import {
  useGetCouponQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "../../../redux/api/paymentApi";

const DiscountManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // RTK Query hooks
  const { data, isLoading, error } = useGetCouponQuery(id);


  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  // local state
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (data?.coupon) {
      setCode(data.coupon.code);
      setAmount(data.coupon.amount);
    }
  }, [data]);

  if (error) toast.error("Failed to load coupon");

  // update handler
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await updateCoupon({
        couponId: id!,
        body: { code, amount },
      }).unwrap();

      toast.success(res.message);
      navigate("/admin/discount");
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  // delete handler
  const deleteHandler = async () => {
    try {
      const res = await deleteCoupon(id!).unwrap();
      toast.success(res.message);
      navigate("/admin/discount");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <article>
            <button
              className="product-delete-btn"
              onClick={deleteHandler}
              disabled={isDeleting}
            >
              <FaTrash />
            </button>

            <form onSubmit={submitHandler}>
              <h2>Manage Coupon</h2>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div>
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <button disabled={isUpdating} type="submit">
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </form>
          </article>
        )}
      </main>
    </div>
  );
};

export default DiscountManagement;
