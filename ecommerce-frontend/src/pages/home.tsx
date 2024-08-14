import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
const addToCartHandler = () => {};
const Home = () => {
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
          <ProductCard
            productId="5755"
            name="Macbook"
            photo="https://m.media-amazon.com/images/I/61HUaSA6c0L._AC_UY218_.jpg"
            price={555}
            stock={555}
            handler={addToCartHandler}
          />
          <ProductCard
            productId="5755"
            name="Macbook"
            photo="https://m.media-amazon.com/images/I/41DeT328kPL._AC_UY218_.jpg"
            price={555}
            stock={555}
            handler={addToCartHandler}
          />
        </main>
      </div>
      ;
    </>
  );
};

export default Home;
