import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import { Skelton } from "../components/loader";
import { cartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const { data, isLoading, error } = useLatestProductsQuery("");
  const dispatch = useDispatch();
  const addToCartHandler = (cartItem: cartItem) => {
    if (cartItem.stock < 1) return toast.error("out of stock");
    dispatch(addToCart(cartItem));
    toast.success("added to cart!!");
  };
  if (error) toast.error("cannot fetched product !!");
  return (
    <>
      <div className="home">
        <section></section>
        {/* for images */}
        <h1>
          Latest products
          <Link to={"/search"} className="findmore">
            More
          </Link>
        </h1>

        <main>
          {isLoading ? (
            <Skelton width="80vw" />
          ) : (
            data?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                photo={i.photo}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
              />
            ))
          )}
        </main>
      </div>
      ;
    </>
  );
};

export default Home;
