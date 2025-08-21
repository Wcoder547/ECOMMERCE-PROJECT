import { FormEvent,  useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../../../types/reducer-types";
import { useNewProductMutation } from "../../../redux/api/productApi";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import {useFileHandler } from "6pp";

const NewProduct = () => {
  const { user } = useSelector(
    (state: { userReducer: userReducerInitialState }) => state.userReducer
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);


//states
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState<string>("");


  const [newproduct] = useNewProductMutation();
  const photos = useFileHandler("multiple", 10, 5);

  const submitHnadler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
     try {
    if (!name || !category || !price || !stock || !description) {
      return;
    }
    if (!photos.file || photos.file.length === 0) return;
    const formData = new FormData();
    formData.set("name", name);
     formData.set("description", description);
    formData.set("price", price.toString());
    formData.set("stock", stock.toString());
    formData.set("category", category);
    photos.file.forEach((file) => {
        formData.append("photos", file);
      });

    const res = await newproduct({ id: user?._id || "", formData });

    responseToast(res, navigate, "/admin/product");
     } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

 
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHnadler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
              <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input required type="file" accept="image/*" multiple  onChange={photos.changeHandler} />
            </div>
            {photos.error && <p>{photos.error}</p>}

            {photos.preview.map((img, index) => (
              <img key={index} src={img} alt={`Preview ${index}`} />
            ))}
            <button disabled={isLoading} type="submit">
              {isLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </article>  
      </main>
    </div>
  );
};

export default NewProduct;
