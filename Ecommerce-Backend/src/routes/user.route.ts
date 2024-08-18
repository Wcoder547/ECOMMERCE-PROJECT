import { AdminOnly } from '../middlewares/auth.middleware.js';
import express from "express"
import { deleteUser, getAllUser, getUser, newUser } from "../controllers/user.controller.js";

const app = express.Router();


//route - api/v1/user/new

app.post("/new",newUser)
app.get("/All",AdminOnly,getAllUser)
app.route("/:id").get(getUser).delete(AdminOnly,deleteUser)



export default app;