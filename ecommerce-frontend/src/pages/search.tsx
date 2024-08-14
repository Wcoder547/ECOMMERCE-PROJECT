import { useState } from "react";
import ProductCard from "../components/productCard";

const Search = () => {
  const [sort, setsort] = useState("");
  const [maxprice, setmaxprice] = useState(100000);
  const [category, setcategory] = useState("");
  const [search, setsearch] = useState("");
  const [page, setpage] = useState(1);
  const addToCartHandler = () => {
    return {};
  };
  const nextpage = true;
  const prevpage = false;
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
            <option value="sample1">Sample1</option>
            <option value="sample2">Sample2</option>
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
        <div className="search-product-list">
          <ProductCard
            productId="5755"
            name="Macbook"
            photo="https://m.media-amazon.com/images/I/61HUaSA6c0L._AC_UY218_.jpg"
            price={555}
            stock={555}
            handler={addToCartHandler}
          />
        </div>

        <article>
          <button
            disabled={!prevpage}
            onClick={() => setpage((prev) => prev - 1)}>
            prev
          </button>
          <span>
            {page} of {4}
          </span>
          <button
            disabled={!nextpage}
            onClick={() => setpage((prev) => prev + 1)}>
            next
          </button>
        </article>
      </main>
    </div>
  );
};

export default Search;
