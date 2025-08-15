import { useState } from "react";
import ProductCard from "../components/productCard";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productApi";
import { customError } from "../types/api-types";
import toast from "react-hot-toast";
import { server } from "../redux/store";
import { Skelton } from "../components/loader";
import { cartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Search = () => {
  const dispatch = useDispatch();
  const {
    data: categoriesResponse,
    isError,
    error,
    isLoading: isLoadingCategories,
  } = useCategoriesQuery("");
  const [sort, setsort] = useState("");
  const [maxprice, setmaxprice] = useState(100000);
  const [category, setcategory] = useState("");
  const [search, setsearch] = useState("");
  const [page, setpage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchData,
    isError: productisError,
    error: productError,
  } = useSearchProductsQuery({
    sort,
    search,
    page,
    category,
    price: maxprice,
  });
  // console.log(searchData);

  const addToCartHandler = (cartItem: cartItem) => {
    if (cartItem.stock < 1) return toast.error("out of stock");
    dispatch(addToCart(cartItem));
    toast.success("added to cart!!");
  };
  const nextpage = true;
  const prevpage = false;

  if (isError) {
    const err = error as customError;
    toast.error(err.data.message);
  }
  if (productisError) {
    const err = productError as customError;
    toast.error(err.data.message);
  }
  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <label>Sort</label>
          <select value={sort} onChange={(e) => setsort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price(low to high)</option>
            <option value="dsc">price (high to low)</option>
          </select>
        </div>
        <div>
          <label>Max price:{maxprice || ""}</label>
          <input
            type="range"
            value={maxprice}
            min={100}
            max={100000}
            onChange={(e) => setmaxprice(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setcategory(e.target.value)}>
            <option value="">All</option>
            {!isLoadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>products</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          placeholder="Search By name"
        />
        {productLoading ? (
          <Skelton length={10} />
        ) : (
          <div className="search-product-list">
            {searchData?.products.map((i) => (
              <ProductCard
                productId={i._id}
                name={i.name}
                photo={`${server}/${i.photo}`}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
              />
            ))}
          </div>
        )}

        {searchData && searchData.totalPage > 1 && (
          <article>
            <button
              disabled={!prevpage}
              onClick={() => setpage((prev) => prev - 1)}>
              prev
            </button>
            <span>
              {page} of {searchData.totalPage}
            </span>
            <button
              disabled={!nextpage}
              onClick={() => setpage((prev) => prev + 1)}>
              next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
